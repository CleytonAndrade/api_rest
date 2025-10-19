# API REST

Uma API REST simples construída com Node.js, Express e Sequelize.

## Instalação

1. Clone o repositório:

   ```bash
   git clone https://github.com/seu-usuario/seu-repositorio.git
   ```

2. Instale as dependências do Node.js:

   ```bash
   npm install
   ```

## Ambiente de Desenvolvimento (com Docker)

Este projeto utiliza Docker para rodar o banco de dados de forma isolada, enquanto a aplicação Node.js roda localmente.

**Pré-requisitos:**

- Node.js
- Docker e Docker-Compose

### Passo 1: Configurar Variáveis de Ambiente

1. Copie o arquivo `.env.exemple` para um novo arquivo chamado `.env`.

2. Abra o arquivo `.env` e preencha as variáveis. Para o ambiente de desenvolvimento com Docker, as configurações do banco de dados devem ser:

```DATABASE_HOST=127.0.0.1
 DATABASE_PORT=3306
 DATABASE_USERNAME=root
 DATABASE_PASSWORD=sua_senha_secreta
 DATABASE=escola
```

**Importante:** A senha e o nome do banco (`DATABASE_PASSWORD` e `DATABASE`) devem ser os mesmos referenciados no arquivo `docker-compose.yml`.

### Passo 2: Iniciar o Banco de Dados

Com o Docker em execução, inicie o contêiner do banco de dados:

```bash
docker-compose up -d
```

Este comando vai baixar a imagem do MariaDB (se necessário) e iniciar o serviço `database` em segundo plano.

### Passo 3: Preparar o Banco de Dados

Com o contêiner do banco de dados rodando, você precisa criar as tabelas e popular os dados iniciais.

```bash
# Cria as tabelas
npx sequelize-cli db:migrate

# Popula o banco com dados iniciais
npx sequelize-cli db:seed:all
```

### Passo 4: Iniciar a API

Finalmente, inicie o servidor da aplicação:

```bash
npm run dev
```

A API estará disponível em `http://localhost:3001`.

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
