import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { pool, testDatabaseConnection } from './db.js';

const app = express();
const PORT = Number(process.env.PORT || 3333);
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

app.use(cors());
app.use(express.json({ limit: '2mb' }));

function signToken(user) {
  return jwt.sign({ id: user.id, role: user.role, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
}

async function auth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Token não informado.' });

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const [rows] = await pool.query('SELECT id, name, email, role, avatar_url, bio, created_at FROM users WHERE id = ?', [payload.id]);
    if (!rows[0]) return res.status(401).json({ message: 'Usuário não encontrado.' });
    req.user = rows[0];
    next();
  } catch {
    return res.status(401).json({ message: 'Token inválido ou expirado.' });
  }
}

function normalizeWorthIt(value) {
  const map = {
    Sim: 'sim',
    sim: 'sim',
    'Mais ou menos': 'mais_ou_menos',
    mais_ou_menos: 'mais_ou_menos',
    Não: 'nao',
    Nao: 'nao',
    nao: 'nao',
  };
  return map[value] || value;
}

app.get('/health', async (_req, res) => {
  try {
    await testDatabaseConnection();
    res.json({ ok: true, service: 'montenegro-api' });
  } catch (error) {
    res.status(500).json({ ok: false, message: 'Banco indisponível.', error: error.message });
  }
});

app.post('/auth/register', async (req, res) => {
  try {
    const { name, email, password, role = 'avaliador' } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Nome, e-mail e senha são obrigatórios.' });
    if (password.length < 6) return res.status(400).json({ message: 'A senha precisa ter pelo menos 6 caracteres.' });
    if (!['admin', 'avaliador'].includes(role)) return res.status(400).json({ message: 'Tipo de usuário inválido.' });

    const normalizedEmail = email.trim().toLowerCase();
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [normalizedEmail]);
    if (existing.length) return res.status(409).json({ message: 'Este e-mail já está cadastrado.' });

    const passwordHash = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [name.trim(), normalizedEmail, passwordHash, role]
    );
    const user = { id: result.insertId, name: name.trim(), email: normalizedEmail, role };
    res.status(201).json({ token: signToken(user), user });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar usuário.', error: error.message });
  }
});

app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'E-mail e senha são obrigatórios.' });

    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email.trim().toLowerCase()]);
    const user = rows[0];
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ message: 'E-mail ou senha incorretos.' });
    }

    const publicUser = { id: user.id, name: user.name, email: user.email, role: user.role, avatar_url: user.avatar_url, bio: user.bio };
    res.json({ token: signToken(publicUser), user: publicUser });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao fazer login.', error: error.message });
  }
});

app.get('/auth/me', auth, (req, res) => res.json({ user: req.user }));

app.put('/users/me', auth, async (req, res) => {
  try {
    const { name, bio, avatar_url } = req.body;
    await pool.query(
      'UPDATE users SET name = COALESCE(?, name), bio = ?, avatar_url = ? WHERE id = ?',
      [name?.trim() || null, bio ?? null, avatar_url ?? null, req.user.id]
    );
    const [rows] = await pool.query('SELECT id, name, email, role, avatar_url, bio, created_at FROM users WHERE id = ?', [req.user.id]);
    res.json({ user: rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar perfil.', error: error.message });
  }
});

app.get('/works', async (req, res) => {
  try {
    const { kind, search } = req.query;
    const where = [];
    const params = [];
    if (kind) { where.push('w.kind = ?'); params.push(kind); }
    if (search) { where.push('(w.title LIKE ? OR w.creator LIKE ?)'); params.push(`%${search}%`, `%${search}%`); }

    const [rows] = await pool.query(`
      SELECT w.*, COALESCE(ROUND(AVG(r.rating), 1), 0) AS rating, COUNT(r.id) AS review_count
      FROM works w
      LEFT JOIN reviews r ON r.work_id = w.id
      ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
      GROUP BY w.id
      ORDER BY w.created_at DESC
    `, params);
    res.json({ works: rows });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao listar obras.', error: error.message });
  }
});

app.get('/works/:id', async (req, res) => {
  try {
    const [works] = await pool.query(`
      SELECT w.*, COALESCE(ROUND(AVG(r.rating), 1), 0) AS rating, COUNT(r.id) AS review_count
      FROM works w LEFT JOIN reviews r ON r.work_id = w.id
      WHERE w.id = ? GROUP BY w.id
    `, [req.params.id]);
    if (!works[0]) return res.status(404).json({ message: 'Obra não encontrada.' });

    const [reviews] = await pool.query(`
      SELECT r.*, u.name AS user_name, u.avatar_url
      FROM reviews r JOIN users u ON u.id = r.user_id
      WHERE r.work_id = ? ORDER BY r.created_at DESC
    `, [req.params.id]);
    res.json({ work: works[0], reviews });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao carregar obra.', error: error.message });
  }
});

app.post('/works', auth, async (req, res) => {
  try {
    const { title, kind, creator, publisher, release_date, year, genre, synopsis, image_url } = req.body;
    if (!title || !kind || !creator) return res.status(400).json({ message: 'Título, tipo e autor/diretor são obrigatórios.' });
    if (!['livro', 'filme', 'serie'].includes(kind)) return res.status(400).json({ message: 'Tipo de obra inválido.' });

    const [result] = await pool.query(`
      INSERT INTO works (title, kind, creator, publisher, release_date, year, genre, synopsis, image_url, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [title.trim(), kind, creator.trim(), publisher || null, release_date || null, year || null, genre || null, synopsis || null, image_url || null, req.user.id]);
    const [rows] = await pool.query('SELECT * FROM works WHERE id = ?', [result.insertId]);
    res.status(201).json({ work: rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao cadastrar obra.', error: error.message });
  }
});

app.post('/works/:id/reviews', auth, async (req, res) => {
  try {
    const { mode = 'rapida', rating, worth_it, comment, emotion, verdict, scores } = req.body;
    const numericRating = Number(rating);
    if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({ message: 'A nota precisa ser um número inteiro entre 1 e 5.' });
    }
    const normalizedWorth = normalizeWorthIt(worth_it);
    if (!['sim', 'mais_ou_menos', 'nao'].includes(normalizedWorth)) {
      return res.status(400).json({ message: 'Resposta de valeu a pena inválida.' });
    }

    await pool.query(`
      INSERT INTO reviews (user_id, work_id, mode, rating, worth_it, comment, emotion, verdict, scores)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE mode = VALUES(mode), rating = VALUES(rating), worth_it = VALUES(worth_it), comment = VALUES(comment), emotion = VALUES(emotion), verdict = VALUES(verdict), scores = VALUES(scores), updated_at = CURRENT_TIMESTAMP
    `, [req.user.id, req.params.id, mode, numericRating, normalizedWorth, comment || null, emotion || null, verdict || null, scores ? JSON.stringify(scores) : null]);

    const [rows] = await pool.query('SELECT * FROM reviews WHERE user_id = ? AND work_id = ?', [req.user.id, req.params.id]);
    res.status(201).json({ review: rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao salvar avaliação.', error: error.message });
  }
});

app.get('/reviews/me', auth, async (req, res) => {
  const [rows] = await pool.query(`
    SELECT r.*, w.title, w.kind, w.image_url
    FROM reviews r JOIN works w ON w.id = r.work_id
    WHERE r.user_id = ? ORDER BY r.updated_at DESC
  `, [req.user.id]);
  res.json({ reviews: rows });
});

app.get('/shelves', auth, async (req, res) => {
  const [shelves] = await pool.query('SELECT * FROM shelves WHERE user_id = ? ORDER BY created_at', [req.user.id]);
  for (const shelf of shelves) {
    const [items] = await pool.query(`
      SELECT w.* FROM shelf_items si JOIN works w ON w.id = si.work_id WHERE si.shelf_id = ? ORDER BY si.created_at DESC
    `, [shelf.id]);
    shelf.items = items;
  }
  res.json({ shelves });
});

app.post('/shelves', auth, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name?.trim()) return res.status(400).json({ message: 'Nome da estante é obrigatório.' });
    const [result] = await pool.query('INSERT INTO shelves (user_id, name) VALUES (?, ?)', [req.user.id, name.trim()]);
    const [rows] = await pool.query('SELECT * FROM shelves WHERE id = ?', [result.insertId]);
    res.status(201).json({ shelf: rows[0] });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') return res.status(409).json({ message: 'Você já possui uma estante com esse nome.' });
    res.status(500).json({ message: 'Erro ao criar estante.', error: error.message });
  }
});

app.post('/shelves/:id/items', auth, async (req, res) => {
  try {
    const { work_id } = req.body;
    const [owned] = await pool.query('SELECT id FROM shelves WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    if (!owned[0]) return res.status(404).json({ message: 'Estante não encontrada.' });
    await pool.query('INSERT IGNORE INTO shelf_items (shelf_id, work_id) VALUES (?, ?)', [req.params.id, work_id]);
    res.status(201).json({ ok: true });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao adicionar obra à estante.', error: error.message });
  }
});

app.delete('/shelves/:id/items/:workId', auth, async (req, res) => {
  const [owned] = await pool.query('SELECT id FROM shelves WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
  if (!owned[0]) return res.status(404).json({ message: 'Estante não encontrada.' });
  await pool.query('DELETE FROM shelf_items WHERE shelf_id = ? AND work_id = ?', [req.params.id, req.params.workId]);
  res.status(204).send();
});

app.use((req, res) => res.status(404).json({ message: `Rota não encontrada: ${req.method} ${req.path}` }));

app.listen(PORT, async () => {
  try {
    await testDatabaseConnection();
    console.log(`Montenegro API rodando em http://localhost:${PORT}`);
    console.log('MySQL conectado com sucesso.');
  } catch (error) {
    console.error('API iniciou, mas não conseguiu conectar ao MySQL:', error.message);
  }
});
