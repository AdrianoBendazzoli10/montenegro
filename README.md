# Montenegro

Aplicativo em **React Native + Expo + TypeScript**, com backend em **Python + FastAPI** e banco **MySQL**, implementado a partir do Figma **Montenegro — Entre Capas e Telas**.

## Stack

- React Native + Expo 54 + TypeScript
- React Navigation
- Poppins, Cinzel e Roboto
- FastAPI
- SQLAlchemy 2
- MySQL + PyMySQL
- JWT
- AsyncStorage para persistir a sessão

## Estrutura

```text
montenegro/
├─ App.tsx
├─ src/
│  ├─ components/         # header, footer e componentes compartilhados
│  ├─ screens/            # telas do aplicativo
│  ├─ services/api.ts     # cliente da API + sessão JWT
│  ├─ navigation/
│  └─ theme/
└─ backend/
   ├─ app/
   │  ├─ main.py          # API FastAPI
   │  ├─ database.py      # conexão MySQL
   │  ├─ models.py        # modelos SQLAlchemy
   │  ├─ schemas.py       # schemas Pydantic
   │  └─ security.py      # JWT + senha
   ├─ sql/schema.sql
   ├─ sql/seed.sql
   ├─ requirements.txt
   └─ .env.example
```

## 1. Criar o banco MySQL

No MySQL Workbench, phpMyAdmin ou terminal, execute:

```sql
backend/sql/schema.sql
```

Depois, para carregar as obras iniciais:

```sql
backend/sql/seed.sql
```

O banco utilizado é `montenegro`.

## 2. Configurar o backend FastAPI

No Windows:

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
```

Edite `backend/.env`:

```env
HOST=0.0.0.0
PORT=3333
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=SUA_SENHA
DB_NAME=montenegro
JWT_SECRET=troque-por-uma-chave-grande-e-segura
JWT_EXPIRE_DAYS=7
CORS_ORIGINS=*
```

Inicie a API:

```bash
uvicorn app.main:app --host 0.0.0.0 --port 3333 --reload
```

Teste:

```text
http://127.0.0.1:3333/health
```

A documentação automática fica em:

```text
http://127.0.0.1:3333/docs
```

## 3. Configurar o aplicativo

Na raiz do projeto:

```bash
npm install
```

Crie um `.env` baseado em `.env.example`.

### Web/emulador no mesmo PC

```env
EXPO_PUBLIC_API_URL=http://127.0.0.1:3333
```

### Celular físico com Expo Go

No celular, `localhost` aponta para o próprio celular. Descubra o IPv4 do PC:

```bash
ipconfig
```

Exemplo:

```env
EXPO_PUBLIC_API_URL=http://192.168.0.15:3333
```

PC e celular precisam estar na mesma rede Wi-Fi e o firewall precisa permitir a porta `3333`.

## 4. Rodar o aplicativo

```bash
npx expo start
```

Abra pelo Expo Go, Android/iOS ou web.

## Fluxos integrados

- Cadastro de usuário
- Login com senha criptografada e JWT
- Sessão persistida no aparelho
- Perfil e edição de perfil
- Catálogo de livros, filmes e séries
- Detalhes das obras
- Cadastro de novas obras
- Avaliação rápida
- Avaliação detalhada em etapas
- Listagem das avaliações do usuário
- Estantes personalizadas
- Criação de nova estante
- Adição/remoção de itens pelas rotas da API
- Média e quantidade de avaliações por obra

## Principais rotas da API

```text
GET    /health
POST   /auth/register
POST   /auth/login
GET    /auth/me
PUT    /users/me
GET    /works
GET    /works/{id}
POST   /works
POST   /works/{id}/reviews
GET    /reviews/me
GET    /shelves
POST   /shelves
POST   /shelves/{id}/items
DELETE /shelves/{id}/items/{workId}
```

Rotas de perfil, cadastro de obra, avaliações e estantes protegidas usam `Authorization: Bearer <token>`.

## Figma e assets

As telas foram reconstruídas tomando o Figma como referência, incluindo as cores principais `#343399`, `#009172` e `#EBBC00`, tipografia e estrutura responsiva.

Algumas imagens ainda são carregadas pelas URLs de assets exportadas pelo próprio Figma. Essas URLs são temporárias; para produção, os PNG/SVG precisam ser copiados para `assets/` ou hospedados de forma permanente.

## Google Login

O botão visual do Google está presente conforme o Figma, mas o OAuth real exige credenciais de um projeto Google (Client IDs para as plataformas usadas). Sem essas credenciais, o login funcional disponível é e-mail + senha.
