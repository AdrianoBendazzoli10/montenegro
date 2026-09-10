# Montenegro

Aplicativo em **React Native + Expo + TypeScript**, com backend em **Node.js + Express** e banco **MySQL**, baseado no Figma **Montenegro — Entre Capas e Telas**.

## Estrutura

```text
montenegro/
├─ App.tsx                 # app mobile
├─ src/                    # telas, componentes, dados e cliente da API
└─ backend/
   ├─ src/server.js        # API REST
   ├─ src/db.js            # conexão MySQL
   ├─ sql/schema.sql       # criação do banco/tabelas
   ├─ sql/seed.sql         # obras iniciais
   └─ .env.example
```

## O que o backend já faz

- Cadastro de usuário
- Login com senha criptografada e JWT
- Papéis `admin` e `avaliador`
- Perfil do usuário
- Cadastro e busca de livros, filmes e séries
- Avaliação rápida e detalhada
- Uma avaliação por usuário/obra, com atualização caso avalie novamente
- Estantes personalizadas
- Adicionar/remover obras das estantes
- Média e quantidade de avaliações por obra

## 1. Criar o banco MySQL

Abra o MySQL Workbench, phpMyAdmin ou terminal do MySQL e execute primeiro:

```sql
backend/sql/schema.sql
```

Depois execute:

```sql
backend/sql/seed.sql
```

Isso cria o banco `montenegro` e adiciona algumas obras iniciais.

## 2. Configurar e iniciar o backend

```bash
cd backend
npm install
```

Copie `backend/.env.example` para `backend/.env` e ajuste seus dados do MySQL:

```env
PORT=3333
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=SUA_SENHA
DB_NAME=montenegro
JWT_SECRET=coloque-uma-chave-grande-aqui
```

Depois rode:

```bash
npm run dev
```

Teste no navegador:

```text
http://localhost:3333/health
```

Se estiver certo, deve aparecer `ok: true`.

## 3. Conectar o app à API

Na raiz do projeto, crie um arquivo `.env` usando `.env.example` como base.

### Emulador/web no mesmo PC

```env
EXPO_PUBLIC_API_URL=http://localhost:3333
```

### Celular físico com Expo Go

No celular, `localhost` aponta para o próprio celular. Use o **IPv4 do computador** que está rodando o backend.

No Windows:

```bash
ipconfig
```

Exemplo, se o IPv4 do PC for `192.168.0.15`:

```env
EXPO_PUBLIC_API_URL=http://192.168.0.15:3333
```

O PC e o celular precisam estar na mesma rede Wi-Fi.

## 4. Rodar o aplicativo

Em outro terminal, na raiz:

```bash
npm install
npx expo start
```

Abra pelo Expo Go ou emulador.

## Principais rotas da API

```text
POST   /auth/register
POST   /auth/login
GET    /auth/me
PUT    /users/me
GET    /works
GET    /works/:id
POST   /works
POST   /works/:id/reviews
GET    /reviews/me
GET    /shelves
POST   /shelves
POST   /shelves/:id/items
DELETE /shelves/:id/items/:workId
```

As rotas de cadastro de obra, avaliação e estantes exigem o token JWT recebido no login/cadastro.

## Observações

O login, cadastro, cadastro de obra e avaliações do aplicativo já estão preparados para conversar com a API. O catálogo visual ainda mantém parte dos dados mockados do Figma para preservar o layout enquanto a integração completa com todas as telas é finalizada.

Os assets vindos diretamente do Figma usam URLs temporárias e futuramente devem ser salvos localmente ou hospedados de forma permanente.
