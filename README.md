# API REST

Uma API REST simples construída com Node.js, Express e Sequelize, projetada para rodar com um banco de dados MariaDB via Docker.

## Guia de Instalação e Execução (Servidor Linux)

Este guia descreve o processo completo para configurar e rodar esta aplicação em um servidor Linux (como Ubuntu/Debian) com o banco de dados rodando em um contêiner Docker.

### Passo 1: Instalação das Ferramentas Essenciais

Acesse o terminal do seu servidor e instale as ferramentas necessárias.

**1.1 - Pacotes Básicos (Node, Git, etc.)**
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y nodejs npm git
```

**1.2 - Docker e Docker Compose**

Os comandos abaixo são para instalar o Docker em uma distribuição baseada em Debian/Ubuntu.

```bash
# Instalar dependências para o repositório Docker
sudo apt-get install -y ca-certificates curl gnupg

# Adicionar a chave GPG oficial do Docker
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# Configurar o repositório
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update

# Instalar o Docker Engine e o Compose
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

**1.3 - PM2 (Process Manager)**

Instale o PM2 globalmente para gerenciar a aplicação Node.js.

```bash
sudo npm install -g pm2
```

### Passo 2: Configuração do Projeto

1.  **Clone o repositório** para o servidor:

    ```bash
    git clone https://github.com/seu-usuario/seu-repositorio.git
    cd seu-repositorio
    ```

2.  **Instale as dependências** do Node.js:
    ```bash
npm install
```

3.  **Crie e configure o arquivo de ambiente**:
    ```bash
    cp .env.exemple .env
    ```
    - Abra o arquivo `.env` e preencha **todas** as variáveis. Preste atenção especial em:
      - `DATABASE_HOST=127.0.0.1`
      - `DATABASE_PASSWORD` (defina uma senha forte)
      - `DATABASE` (defina o nome do banco)

### Passo 3: Inicialização do Banco de Dados

O arquivo `docker-compose.yml` (incluso no repositório) irá utilizar as variáveis definidas no seu arquivo `.env` para configurar o contêiner do banco de dados.

Para iniciar o contêiner, execute o comando:
```bash
docker-compose up -d
```
*Para garantir que está começando do zero, você pode rodar `docker-compose down -v` antes, se já tiver tentado iniciar o contêiner anteriormente.*

### Passo 4: Preparação do Banco de Dados

Com o contêiner rodando, execute os seguintes comandos para criar as tabelas e adicionar os dados iniciais.
```bash
# Cria as tabelas no banco
npx sequelize-cli db:migrate

# Popula o banco com dados iniciais (se houver)
npx sequelize-cli db:seed:all
```

### Passo 5: Iniciar a Aplicação com PM2

Use o PM2 para iniciar a aplicação em segundo plano para que ela continue rodando mesmo que o terminal seja fechado.

```bash
pm2 start src/server.js --name api-rest
```

- Para ver o status da sua aplicação, use `pm2 list`.
- Para ver os logs em tempo real, use `pm2 logs api-rest`.

### Passo 6: Configurar o Nginx como Proxy Reverso

O Nginx irá atuar como a "porta de entrada" para sua API, recebendo o tráfego público (porta 80) e redirecionando-o para a sua aplicação (que está rodando na porta 3001).

1.  **Crie o arquivo de configuração do Nginx**:

    ```bash
    sudo nano /etc/nginx/sites-available/api-rest
    ```

2.  **Cole o seguinte conteúdo** no arquivo. Lembre-se de substituir `seu-dominio.com` pelo seu domínio real.
    ```nginx
server {
    listen 80;
    server_name seu-dominio.com;

    location / {
        proxy_pass http://localhost:3001; # Redireciona para a API
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

3.  **Ative a configuração e reinicie o Nginx**:

    ```bash

    ```bash
# Cria um link para ativar o site
sudo ln -s /etc/nginx/sites-available/api-rest /etc/nginx/sites-enabled/

# (Opcional) Remove o site padrão para evitar conflitos

sudo rm /etc/nginx/sites-enabled/default

# Testa a sintaxe da configuração

sudo nginx -t

# Reinicia o Nginx para aplicar as alterações

sudo systemctl restart nginx
```

### Passo 7: Habilitar SSL com Certbot

Com o Nginx configurado e seu DNS apontando para o IP do servidor, use o Certbot para instalar um certificado SSL gratuito.
```bash
sudo certbot --nginx -d seu-dominio.com
```

O Certbot irá alterar sua configuração do Nginx automaticamente para lidar com o tráfego HTTPS (porta 443).

---

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

```