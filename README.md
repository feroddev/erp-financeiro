# Mini ERP Financeiro

Sistema de gestão financeira fullstack desenvolvido como teste técnico para vaga de Desenvolvedor Fullstack Pleno.

## 🎯 Sobre o Projeto

Aplicação completa para gerenciamento financeiro com controle de clientes, contas a pagar e receber, e relatórios gerenciais. Desenvolvida seguindo as melhores práticas de desenvolvimento, incluindo Clean Code, princípios SOLID e arquitetura em camadas.

## 🚀 Tecnologias Utilizadas

### Backend
- **NestJS** - Framework Node.js progressivo com TypeScript
- **TypeORM** - ORM para gerenciamento do banco de dados
- **PostgreSQL** - Banco de dados relacional
- **Passport JWT** - Autenticação e autorização
- **class-validator** - Validação de dados
- **Swagger** - Documentação automática da API

### Frontend
- **Angular 18** - Framework web moderno
- **TypeScript** - Linguagem tipada
- **Tailwind CSS** - Framework CSS utility-first
- **RxJS** - Programação reativa
- **Angular Router** - Gerenciamento de rotas

### DevOps
- **Docker** - Containerização da aplicação
- **Docker Compose** - Orquestração de containers

## 📋 Funcionalidades

### Gestão de Clientes
- Cadastro, edição e exclusão de clientes
- Busca e filtros
- Validação de dados (email único, documentos)
- Soft delete para preservação de histórico

### Contas a Pagar e Receber
- Registro de transações financeiras
- Classificação por tipo (a pagar/receber)
- Controle de status (pendente, pago, vencido, cancelado)
- Vinculação com clientes
- Marcação de pagamento
- Filtros por período, status e tipo
- Paginação de resultados

### Relatórios Financeiros
- Resumo financeiro consolidado
- Fluxo de caixa por período
- Análise de contas pendentes e vencidas
- Visualização por cliente

### Autenticação e Segurança
- Sistema de login com JWT
- Registro de novos usuários
- Proteção de rotas
- Senhas criptografadas com bcrypt
- Tokens com expiração configurável

## 🏗️ Arquitetura

### Backend (NestJS)

```
backend/src/
├── auth/                    # Autenticação JWT
├── users/                   # Gestão de usuários
├── clients/                 # Gestão de clientes
├── transactions/            # Contas a pagar/receber
├── reports/                 # Relatórios financeiros
├── common/                  # Filtros e interceptors
├── config/                  # Configurações
└── database/
    ├── migrations/          # Migrations do banco
    └── seeds/               # Dados iniciais
```

**Princípios aplicados:**
- **Separation of Concerns**: Controllers, Services e Repositories com responsabilidades bem definidas
- **Dependency Injection**: Injeção de dependências nativa do NestJS
- **DTOs**: Validação e transformação de dados
- **Exception Handling**: Tratamento centralizado de erros
- **Soft Delete**: Deleção lógica para preservação de histórico

### Frontend (Angular)

```
frontend/src/app/
├── core/                    # Serviços singleton
│   ├── guards/              # Route guards
│   ├── interceptors/        # HTTP interceptors
│   ├── models/              # Interfaces TypeScript
│   └── services/            # Serviços globais
└── features/                # Módulos de funcionalidades
    ├── auth/                # Login e registro
    └── dashboard/           # Dashboard principal
```

**Padrões implementados:**
- **Smart/Dumb Components**: Separação entre componentes com lógica e apresentação
- **Reactive Programming**: RxJS para operações assíncronas
- **Route Guards**: Proteção de rotas autenticadas
- **HTTP Interceptors**: Adição automática de tokens JWT

## 🔧 Instalação e Execução

### Pré-requisitos
- Docker (versão 20.10+)
- Docker Compose (versão 2.0+)

### Passo a Passo

1. **Clone o repositório**
```bash
git clone <seu-repositorio>
cd mini-ERP-financeiro
```

2. **Inicie os containers**
```bash
docker compose up -d --build
```

Este comando irá:
- Construir as imagens do frontend e backend
- Inicializar o PostgreSQL
- Executar as migrations automaticamente
- Popular o banco com dados de exemplo (seeds)
- Iniciar todos os serviços

3. **Acesse a aplicação**

| Serviço | URL | Descrição |
|---------|-----|-----------|
| Frontend | http://localhost:4200 | Interface do usuário |
| Backend | http://localhost:3000 | API REST |
| Swagger | http://localhost:3000/api/docs | Documentação da API |

4. **Credenciais de acesso**
```
Email: admin@example.com
Senha: admin123
```

### Comandos Úteis

```bash
# Ver logs
docker compose logs -f

# Ver logs de um serviço específico
docker compose logs -f backend
docker compose logs -f frontend

# Parar os containers
docker compose down

# Parar e remover volumes (reset completo)
docker compose down -v

# Reiniciar serviços
docker compose restart

# Acessar shell do backend
docker compose exec backend sh

# Executar migrations manualmente
docker compose exec backend npm run migration:run

# Executar seeds manualmente
docker compose exec backend npm run seed:run
```

## 💻 Desenvolvimento Local (sem Docker)

### Backend
```bash
cd backend
npm install
npm run start:dev
```

### Frontend
```bash
cd frontend
npm install
npm start
```

**Nota:** Configure as variáveis de ambiente no arquivo `.env` do backend.

## 🧪 Testes

### Backend
```bash
cd backend
npm test                    # Testes unitários
npm run test:cov           # Coverage
npm run test:e2e           # Testes E2E
```

### Frontend
```bash
cd frontend
npm test
```

## 📊 Qualidade de Código

### Clean Code
- Nomes descritivos e significativos
- Funções pequenas e com responsabilidade única
- Código auto-explicativo
- Formatação consistente com Prettier
- Princípio DRY (Don't Repeat Yourself)

### SOLID
- **Single Responsibility**: Cada classe/módulo tem uma única responsabilidade
- **Open/Closed**: Aberto para extensão, fechado para modificação
- **Liskov Substitution**: Uso correto de herança e interfaces
- **Interface Segregation**: Interfaces específicas e coesas
- **Dependency Inversion**: Dependência de abstrações via injeção

### DDD (Domain-Driven Design)
- Entities bem definidas (Client, Transaction, User)
- Value Objects (Enums para estados)
- Services com lógica de domínio encapsulada
- Repositories para acesso a dados
- DTOs para transferência de dados

### Tipagem TypeScript
- Strict mode configurado
- Interfaces para todos os contratos
- Enums para valores fixos
- Validação em runtime com class-validator

### Linters
```bash
# Backend
cd backend
npm run lint
npm run format

# Frontend
cd frontend
npm run lint
```

## 🗄️ Banco de Dados

### Modelo de Dados

**users**
- Autenticação e autorização
- Senhas criptografadas com bcrypt

**clients**
- Informações de clientes
- Email único
- Soft delete

**transactions**
- Contas a pagar e receber
- Relacionamento com clientes
- Controle de status e pagamentos
- Soft delete

### Migrations

As migrations são executadas automaticamente ao iniciar os containers. Para executar manualmente:

```bash
docker compose exec backend npm run migration:run
```

### Seeds

Dados de exemplo são criados automaticamente, incluindo:
- 1 usuário admin
- 10 clientes
- 30 transações (mix de contas a pagar e receber)

## 📚 Documentação da API

A documentação completa da API está disponível via Swagger UI após iniciar a aplicação:

**URL:** http://localhost:3000/api/docs

### Principais Endpoints

**Autenticação**
- `POST /auth/register` - Registrar novo usuário
- `POST /auth/login` - Fazer login

**Clientes**
- `GET /clients` - Listar clientes (com paginação e filtros)
- `GET /clients/:id` - Buscar cliente por ID
- `POST /clients` - Criar novo cliente
- `PATCH /clients/:id` - Atualizar cliente
- `DELETE /clients/:id` - Remover cliente (soft delete)

**Transações**
- `GET /transactions` - Listar transações (com filtros)
- `GET /transactions/:id` - Buscar transação por ID
- `POST /transactions` - Criar nova transação
- `PATCH /transactions/:id` - Atualizar transação
- `DELETE /transactions/:id` - Remover transação (soft delete)
- `POST /transactions/:id/pay` - Marcar como paga

**Relatórios**
- `GET /reports/summary` - Resumo financeiro
- `GET /reports/cashflow` - Fluxo de caixa

## 🔐 Segurança

- Autenticação JWT com tokens de expiração
- Senhas criptografadas com bcrypt (10 rounds)
- Validação de entrada em todos os endpoints
- CORS configurado
- Exception handling centralizado
- Soft delete para preservação de dados

**⚠️ Importante:** As credenciais padrão são apenas para desenvolvimento. Em produção, altere todas as senhas e use variáveis de ambiente seguras.

## 🐳 Docker

### Estrutura

O projeto utiliza Docker Compose com 3 serviços:

1. **postgres** - PostgreSQL 16 Alpine
2. **backend** - API NestJS
3. **frontend** - Angular + Nginx

### Configuração

As variáveis de ambiente estão definidas no `docker-compose.yml`:

```yaml
# Backend
NODE_ENV: development
PORT: 3000
DB_HOST: postgres
DB_PORT: 5432
DB_USERNAME: postgres
DB_PASSWORD: postgres
DB_DATABASE: mini_erp
JWT_SECRET: your-super-secret-jwt-key-change-in-production
JWT_EXPIRATION: 1d
```

### Volumes

- `postgres_data` - Persistência dos dados do banco

### Network

- `mini-erp-network` - Rede bridge isolada para comunicação entre serviços

## 🚨 Troubleshooting

### Porta já em uso
```bash
# Verificar processos usando as portas
sudo lsof -i :3000
sudo lsof -i :4200
sudo lsof -i :5432

# Matar processo
sudo kill -9 <PID>
```

### Containers não iniciam
```bash
# Reset completo
docker compose down -v
docker compose up -d --build
```

### Erro de permissão
```bash
# Limpar volumes e reconstruir
docker compose down -v
sudo rm -rf backend/node_modules frontend/node_modules
docker compose up -d --build
```

### Banco de dados não conecta
```bash
# Verificar status do PostgreSQL
docker compose ps postgres
docker compose logs postgres

# Reiniciar PostgreSQL
docker compose restart postgres
```

## 📝 Estrutura do Projeto

```
mini-ERP-financeiro/
├── backend/
│   ├── src/
│   │   ├── auth/
│   │   ├── clients/
│   │   ├── common/
│   │   ├── config/
│   │   ├── database/
│   │   ├── reports/
│   │   ├── transactions/
│   │   ├── users/
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── Dockerfile
│   ├── Dockerfile.dev
│   ├── package.json
│   ├── tsconfig.json
│   └── .eslintrc.js
│
├── frontend/
│   ├── src/
│   │   └── app/
│   │       ├── core/
│   │       ├── features/
│   │       ├── app.component.ts
│   │       ├── app.config.ts
│   │       └── app.routes.ts
│   ├── Dockerfile
│   ├── Dockerfile.dev
│   ├── nginx.conf
│   ├── package.json
│   ├── angular.json
│   └── tailwind.config.js
│
├── docker-compose.yml
└── README.md
```

## 🎓 Decisões Técnicas

### Por que NestJS?
- Arquitetura modular e escalável
- TypeScript nativo
- Dependency Injection robusto
- Excelente integração com TypeORM
- Documentação automática com Swagger

### Por que Angular?
- Framework completo e opinativo
- TypeScript nativo
- Dependency Injection
- RxJS para programação reativa
- Excelente tooling e CLI

### Por que TypeORM?
- Migrations para versionamento do banco
- Suporte a relacionamentos complexos
- Query builder type-safe
- Soft delete nativo

### Por que Docker?
- Ambiente consistente entre desenvolvimento e produção
- Fácil setup (um comando para rodar tudo)
- Isolamento de dependências
- Facilita deploy

## 📄 Licença

MIT

---

**Desenvolvido como teste técnico para vaga de Desenvolvedor Fullstack Pleno**
