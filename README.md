# API REST com Node.js

Uma API REST simples construída com Node.js, Express e Sequelize. O ambiente de produção é projetado para rodar com um banco de dados MariaDB via Docker e Nginx como proxy reverso.

## Tecnologias Utilizadas

- **Backend:** Node.js, Express.js
- **Banco de Dados:** Sequelize ORM com MariaDB (via Docker)
- **Autenticação:** JSON Web Tokens (JWT)
- **Deploy:** Docker, PM2, Nginx, Certbot (SSL)

---

## Índice

- [Ambiente de Desenvolvimento Local](#ambiente-de-desenvolvimento-local)
- [Guia de Deploy (Servidor Linux)](#guia-de-deploy-servidor-linux)
- [Endpoints da API](#endpoints-da-api)

---

## Ambiente de Desenvolvimento Local

Siga estes passos para rodar a aplicação na sua máquina local.

### Pré-requisitos

- [Node.js](https://nodejs.org/en/) (versão LTS recomendada)
- [Docker](https://www.docker.com/get-started) e Docker Compose
- [Git](https://git-scm.com/)

### 1. Clone o Repositório

```bash
git clone https://github.com/CleytonAndrade/api_rest.git
cd api_rest
```

### 2. Instale as Dependências

```bash
npm install
```

### 3. Configure as Variáveis de Ambiente

Copie o arquivo de exemplo `.env.exemple` para um novo arquivo chamado `.env`.

```bash
cp .env.exemple .env
```

Agora, abra o arquivo `.env` e preencha as variáveis. Para o ambiente local, as configurações principais são:

- `DATABASE_HOST=127.0.0.1`
- `DATABASE_PORT=3306`
- `DATABASE_USERNAME=root`
- `DATABASE_PASSWORD=` (defina uma senha forte para o root do MariaDB)
- `DATABASE=` (ex: `api_rest_dev`)
- `APP_URL=http://localhost:3001`

### 4. Inicie o Banco de Dados com Docker

O comando abaixo irá iniciar um contêiner Docker com o MariaDB, usando as credenciais que você definiu no arquivo `.env`.

```bash
docker-compose up -d
```

> **Dica:** Se precisar parar e remover o contêiner (incluindo o volume de dados), use `docker-compose down -v`.

### 5. Execute as Migrations e Seeds

Estes comandos irão criar as tabelas e popular o banco de dados com dados iniciais.

```bash
# Criar as tabelas
npx sequelize-cli db:migrate

# Popular o banco (opcional)
npx sequelize-cli db:seed:all
```

### 6. Inicie a Aplicação

```bash
npm run dev
```

A API estará rodando em `http://localhost:3001`.

---

## Guia de Deploy (Servidor Linux)

Este guia descreve o processo para configurar a aplicação em um servidor **Ubuntu/Debian**.

### 1. Pré-requisitos no Servidor

Instale Git, Nginx, Certbot e Docker.

```bash
# Atualiza os pacotes
sudo apt update && sudo apt upgrade -y

# Instala Git, Nginx e Certbot
sudo apt install -y git nginx certbot python3-certbot-nginx

# Instala o Docker e Docker Compose
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

Para o **Node.js**, recomendamos usar o `nvm` (Node Version Manager) para instalar a versão LTS.

```bash
# Instala o nvm e a versão LTS do Node
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
# Recarregue o terminal ou execute 'source ~/.bashrc'
nvm install --lts
```

### 2. Clone e Configure o Projeto

Siga os passos **1, 2 e 3** da seção [Ambiente de Desenvolvimento Local](#ambiente-de-desenvolvimento-local).

No arquivo `.env`, certifique-se de que `APP_URL` aponta para o seu domínio público (ex: `https://api.seusite.com`).

### 3. Inicie o Banco de Dados e a Aplicação

Siga os passos **4 e 5** da seção [Ambiente de Desenvolvimento Local](#ambiente-de-desenvolvimento-local).

Para manter a aplicação rodando em segundo plano, use o `pm2`.

```bash
# Instale o PM2 globalmente
npm install -g pm2

# Inicie a aplicação
pm2 start src/server.js --name api-rest
```

### 4. Configure o Nginx como Proxy Reverso

O Nginx irá direcionar o tráfego da porta 80 (HTTP) e 443 (HTTPS) para a sua aplicação Node.js, que está rodando na porta 3001.

4.1. **Crie o arquivo de configuração do Nginx**:

```bash
sudo nano /etc/nginx/sites-available/api-rest
```

4.2. **Cole a configuração abaixo**, substituindo `seu-dominio.com` pelo seu domínio real.

```nginx
server {
    listen 80;
    server_name seu-dominio.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

4.3. **Ative a configuração e reinicie o Nginx**:

```bash
# Ativa o site criando um link simbólico
sudo ln -s /etc/nginx/sites-available/api-rest /etc/nginx/sites-enabled/

# Testa a sintaxe da configuração
sudo nginx -t

# Reinicia o Nginx
sudo systemctl restart nginx
```

### 5. Habilite SSL com Certbot

Com o DNS do seu domínio já apontando para o IP do servidor, execute o Certbot para obter um certificado SSL gratuito.

```bash
sudo certbot --nginx -d seu-dominio.com
```

O Certbot irá modificar automaticamente sua configuração do Nginx para habilitar o HTTPS. Ao final, reinicie o Nginx para garantir que as mudanças foram aplicadas: `sudo systemctl restart nginx`.

---

## Endpoints da API

| Método     | Endpoint      | Descrição                              | Autenticação  |
| :--------- | :------------ | :------------------------------------- | :------------ |
| **Home**   |
| `GET`      | `/`           | Rota de boas-vindas.                   | Nenhuma       |
| **Token**  |
| `POST`     | `/token`      | Gera um token de autenticação (login). | Nenhuma       |
| **Users**  |
| `POST`     | `/users`      | Cria um novo usuário.                  | Nenhuma       |
| `PUT`      | `/users`      | Atualiza o usuário autenticado.        | **Requerida** |
| `DELETE`   | `/users`      | Exclui o usuário autenticado.          | **Requerida** |
| **Alunos** |
| `GET`      | `/alunos`     | Lista todos os alunos.                 | Nenhuma       |
| `POST`     | `/alunos`     | Cria um novo aluno.                    | **Requerida** |
| `GET`      | `/alunos/:id` | Obtém um aluno específico.             | Nenhuma       |
| `PUT`      | `/alunos/:id` | Atualiza um aluno.                     | **Requerida** |
| `DELETE`   | `/alunos/:id` | Exclui um aluno.                       | **Requerida** |
| **Fotos**  |
| `POST`     | `/fotos`      | Faz upload da foto de um aluno.        | **Requerida** |
