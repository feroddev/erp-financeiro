# Mini ERP Financeiro

Sistema de gestão financeira fullstack containerizado com Docker.

## 🚀 Tecnologias

### Frontend
- **Angular 18+** - Framework web moderno
- **Tailwind CSS** - Framework CSS utility-first
- **TypeScript** - Linguagem tipada
- **Nginx** - Servidor web para produção

### Backend
- **NestJS** - Framework Node.js progressivo
- **TypeORM** - ORM para TypeScript/JavaScript
- **PostgreSQL** - Banco de dados relacional
- **TypeScript** - Linguagem tipada

### Infraestrutura
- **Docker** - Containerização
- **Docker Compose** - Orquestração de containers
- **Rede Docker** - Comunicação entre serviços

## 📋 Pré-requisitos

- Docker (versão 20.10 ou superior)
- Docker Compose (versão 2.0 ou superior)

## 🔧 Instalação e Execução

### 1. Clone o repositório

```bash
git clone <seu-repositorio>
cd mini-ERP-financeiro
```

### 2. Inicie os containers

```bash
docker-compose up --build
```

Este comando irá:
- Construir as imagens do frontend e backend
- Baixar a imagem do PostgreSQL
- Criar a rede Docker compartilhada
- Iniciar todos os serviços

### 3. Acesse a aplicação

- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:3000
- **PostgreSQL**: localhost:5432

## 🏗️ Estrutura do Projeto

```
mini-ERP-financeiro/
├── frontend/                 # Aplicação Angular
│   ├── src/
│   │   ├── app/
│   │   │   ├── app.component.ts
│   │   │   ├── app.component.html
│   │   │   ├── app.component.css
│   │   │   └── app.config.ts
│   │   ├── main.ts
│   │   ├── styles.css
│   │   └── index.html
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   ├── angular.json
│   ├── tailwind.config.js
│   └── tsconfig.json
│
├── backend/                  # API NestJS
│   ├── src/
│   │   ├── app.module.ts
│   │   ├── app.controller.ts
│   │   ├── app.service.ts
│   │   └── main.ts
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json
│   └── nest-cli.json
│
├── docker-compose.yml        # Orquestração dos serviços
└── README.md
```

## 🐳 Serviços Docker

### Frontend (Angular + Nginx)
- **Porta**: 4200
- **Container**: mini-erp-frontend
- Build multi-stage para otimização

### Backend (NestJS)
- **Porta**: 3000
- **Container**: mini-erp-backend
- Conectado ao PostgreSQL via TypeORM

### PostgreSQL
- **Porta**: 5432
- **Container**: mini-erp-postgres
- Volume persistente para dados
- Healthcheck configurado

### Rede
- **Nome**: mini-erp-network
- **Driver**: bridge
- Comunicação entre todos os serviços

## 🛠️ Comandos Úteis

### Parar os containers
```bash
docker-compose down
```

### Parar e remover volumes
```bash
docker-compose down -v
```

### Ver logs
```bash
docker-compose logs -f
```

### Ver logs de um serviço específico
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

### Reconstruir um serviço específico
```bash
docker-compose up --build backend
```

### Executar comandos dentro de um container
```bash
docker-compose exec backend npm run typeorm migration:run
docker-compose exec postgres psql -U postgres -d mini_erp
```

## 🔍 Verificação de Saúde

### Backend
```bash
curl http://localhost:3000/health
```

### PostgreSQL
```bash
docker-compose exec postgres pg_isready -U postgres
```

## 📝 Variáveis de Ambiente

### Backend (.env)
```env
NODE_ENV=development
PORT=3000
DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=mini_erp
```

## 🚀 Desenvolvimento

### Desenvolvimento Local (sem Docker)

#### Backend
```bash
cd backend
npm install
npm run start:dev
```

#### Frontend
```bash
cd frontend
npm install
npm start
```

## 📦 Build para Produção

Os Dockerfiles já estão configurados para produção:

- **Frontend**: Build otimizado do Angular servido pelo Nginx
- **Backend**: Build compilado do NestJS executando com Node.js

## 🔐 Segurança

⚠️ **IMPORTANTE**: As credenciais padrão são apenas para desenvolvimento.

Para produção:
1. Altere as senhas do banco de dados
2. Use variáveis de ambiente seguras
3. Configure HTTPS
4. Implemente autenticação JWT
5. Use secrets do Docker

## 📄 Licença

MIT

## 👥 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📞 Suporte

Para suporte, abra uma issue no repositório.
