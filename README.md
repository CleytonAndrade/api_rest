# API REST

Uma API REST simples construída com Node.js, Express e Sequelize.

## Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/seu-repositorio.git
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```

## Uso

1. Renomeie o arquivo `.env.example` para `.env` e configure as variáveis de ambiente.
2. Inicie o servidor:
   ```bash
   npm run dev
   ```

## Endpoints da API

### Alunos

- `GET /alunos`: Lista todos os alunos.
- `POST /alunos`: Cria um novo aluno (requer autenticação).
- `GET /alunos/:id`: Obtém um aluno específico.
- `PUT /alunos/:id`: Atualiza um aluno (requer autenticação).
- `DELETE /alunos/:id`: Exclui um aluno (requer autenticação).

### Fotos

- `POST /fotos`: Faz upload de uma foto para um aluno (requer autenticação).

### Home

- `GET /`: Rota de boas-vindas.

### Token

- `POST /token`: Gera um token de autenticação.

### Usuários

- `POST /users`: Cria um novo usuário.
- `PUT /users`: Atualiza um usuário (requer autenticação).
- `DELETE /users`: Exclui um usuário (requer autenticação).

## Tecnologias Utilizadas

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [Sequelize](https://sequelize.org/)
- [MariaDB](https://mariadb.org/)
- [JWT](https://jwt.io/)
- [Multer](https://github.com/expressjs/multer)
- [Bcrypt.js](https://github.com/kelektiv/bcrypt.js)
