# 💼 Mini ERP Financeiro

> **📋 Projeto de Teste Técnico**  
> Este projeto foi desenvolvido como teste técnico para demonstração de habilidades em desenvolvimento fullstack, aplicando as melhores práticas de engenharia de software.

Sistema completo de gestão financeira fullstack com controle de clientes, contas a pagar/receber, relatórios gerenciais com gráficos interativos e controle de permissões por roles.

## 🎯 Sobre o Projeto

**Teste Técnico - Desenvolvedor Fullstack**

Aplicação empresarial para gerenciamento financeiro desenvolvida como projeto de avaliação técnica, demonstrando proficiência em:

- Desenvolvimento fullstack com NestJS e Angular
- Aplicação de Clean Code e princípios SOLID
- Arquitetura em camadas e design patterns modernos
- Integração de gráficos interativos com Chart.js
- Sistema de autenticação e autorização com roles
- Containerização com Docker

O sistema oferece controle completo de fluxo de caixa, gestão de clientes e relatórios visuais detalhados.

## ✨ Funcionalidades Principais

### 🔐 Autenticação e Autorização

- Sistema de login com JWT
- Registro de novos usuários
- Controle de permissões por roles (ADMIN/USER)
- Proteção de rotas no frontend e backend
- Senhas criptografadas com bcrypt (10 rounds)
- Tokens com expiração configurável

### 👥 Gestão de Clientes

- ✅ CRUD completo (Criar, Ler, Atualizar, Deletar)
- ✅ Busca por nome com paginação
- ✅ Validação de dados (email único, campos obrigatórios)
- ✅ Soft delete para preservação de histórico
- ✅ Interface responsiva com modais
- ✅ Feedback visual de ações (sucesso/erro)
- 🔒 Criação e exclusão restritas a ADMIN

### 💰 Contas a Pagar e Receber

- ✅ CRUD completo de transações
- ✅ Classificação por tipo (A Pagar / A Receber)
- ✅ Controle de status (Pendente, Pago, Vencido, Cancelado)
- ✅ Vinculação com clientes
- ✅ Ação de quitação (marcar como pago)
- ✅ **Filtros avançados:**
  - Por status (Pendente, Pago, Vencido, Cancelado)
  - Por cliente
  - Por período (data inicial e final)
- ✅ **Paginação completa:**
  - Seletor de itens por página (10, 25, 50, 100)
  - Navegação direta para páginas específicas
  - Botões: Primeira, Anterior, Próxima, Última página
  - Contador de itens (Mostrando X a Y de Z)
- ✅ Validação de datas e valores
- ✅ Interface intuitiva com modais
- 🔒 Criação e exclusão restritas a ADMIN

### 📊 Relatórios Financeiros

- ✅ **Filtro de período obrigatório** (data inicial e final)
- ✅ **Cálculos corretos de totais:**
  - Total a Receber (com breakdown: Pago, Pendente, Vencido)
  - Total a Pagar (com breakdown: Pago, Pendente, Vencido)
  - Saldo do Período (Receber - Pagar)
- ✅ **Gráficos interativos com Chart.js:**
  - Gráfico de Barras: Comparativo A Receber vs A Pagar por status
  - Gráfico de Pizza: Distribuição total por status
  - Tooltips formatados em moeda brasileira (R$)
  - Legendas e cores consistentes
  - Responsivos e adaptativos
- ✅ Tabela detalhada de transações do período
- ✅ Indicadores visuais de saldo positivo/negativo
- ✅ Função de impressão
- ✅ Cards visuais com ícones e cores

### 🎨 Interface do Usuário

- Design moderno e profissional
- Layout responsivo (mobile, tablet, desktop)
- Componentes reutilizáveis
- Feedback visual em todas as ações
- Loading states e skeleton screens
- Modais para criação e edição
- Alertas de confirmação para exclusões
- Navegação intuitiva com header fixo

## 🚀 Tecnologias Utilizadas

### Backend

- **NestJS 10** - Framework Node.js progressivo com TypeScript
- **TypeORM** - ORM para gerenciamento do banco de dados
- **PostgreSQL 16** - Banco de dados relacional
- **Passport JWT** - Autenticação e autorização
- **class-validator** - Validação de dados
- **class-transformer** - Transformação de objetos
- **bcrypt** - Criptografia de senhas
- **Swagger/OpenAPI** - Documentação automática da API

### Frontend

- **Angular 18** - Framework web moderno com standalone components
- **TypeScript** - Linguagem tipada
- **Tailwind CSS** - Framework CSS utility-first
- **Chart.js 4.5** - Biblioteca de gráficos
- **ng2-charts 8.0** - Wrapper Angular para Chart.js
- **RxJS** - Programação reativa
- **Angular Router** - Gerenciamento de rotas
- **FormsModule** - Formulários reativos

### DevOps

- **Docker** - Containerização da aplicação
- **Docker Compose** - Orquestração de containers
- **GitHub Actions** - CI/CD pipeline

## 🏗️ Arquitetura

### Backend (NestJS)

```
backend/src/
├── auth/                      # Autenticação JWT e Roles
│   ├── decorators/           # @Roles, @Public
│   ├── guards/               # JwtAuthGuard, RolesGuard
│   ├── enums/                # Role (ADMIN, USER)
│   └── strategies/           # JWT Strategy
├── users/                     # Gestão de usuários
│   ├── entities/             # User entity com role
│   ├── dto/                  # CreateUser, UpdateUser
│   └── users.service.ts
├── clients/                   # Gestão de clientes
│   ├── entities/             # Client entity
│   ├── dto/                  # CreateClient, UpdateClient
│   └── clients.service.ts
├── transactions/              # Contas a pagar/receber
│   ├── entities/             # Transaction entity
│   ├── dto/                  # CreateTransaction, FilterTransaction
│   ├── enums/                # TransactionKind, TransactionStatus
│   └── transactions.service.ts
├── reports/                   # Relatórios financeiros
│   └── reports.service.ts
├── common/                    # Filtros e interceptors
│   ├── filters/              # Exception filters
│   └── interceptors/         # Transform interceptor
├── config/                    # Configurações
│   └── database.config.ts
└── database/
    ├── migrations/            # Migrations do banco
    └── seeds/                 # Dados iniciais (seed.ts)
```

**Princípios Aplicados:**

- ✅ **Clean Code**: Nomes descritivos, funções pequenas, código auto-explicativo
- ✅ **SOLID**: Responsabilidade única, injeção de dependências, interfaces
- ✅ **DDD**: Entities, Value Objects, Services, Repositories
- ✅ **Separation of Concerns**: Controllers, Services, Repositories
- ✅ **Exception Handling**: Tratamento centralizado de erros
- ✅ **Soft Delete**: Deleção lógica para preservação de histórico
- ✅ **DTOs**: Validação e transformação de dados
- ✅ **Guards**: Proteção de rotas por autenticação e roles

### Frontend (Angular 18)

```
frontend/src/app/
├── core/                      # Serviços singleton
│   ├── guards/               # AuthGuard
│   ├── interceptors/         # AuthInterceptor
│   ├── models/               # Interfaces TypeScript
│   └── services/             # API services
│       ├── auth.service.ts
│       ├── clients.service.ts
│       ├── transactions.service.ts
│       └── reports.service.ts
├── shared/                    # Componentes compartilhados
│   └── components/
│       ├── header/           # Header com navegação
│       ├── card/             # Card reutilizável
│       ├── button/           # Botão customizado
│       ├── alert/            # Alertas de feedback
│       ├── modal/            # Modal genérico
│       ├── table/            # Tabela com paginação
│       └── search-input/     # Input de busca
└── features/                  # Módulos de funcionalidades
    ├── auth/                 # Login e registro
    ├── dashboard/            # Dashboard principal
    ├── clients/              # Gestão de clientes
    ├── receivables/          # Contas a receber
    ├── payables/             # Contas a pagar
    └── reports/              # Relatórios com gráficos
```

**Características:**

- ✅ **Standalone Components**: Arquitetura moderna do Angular 18+
- ✅ **Tailwind CSS**: Estilização utility-first
- ✅ **Componentes Reutilizáveis**: Table, Card, Button, Modal, Alert
- ✅ **Smart/Dumb Components**: Separação de lógica e apresentação
- ✅ **Reactive Programming**: RxJS para operações assíncronas
- ✅ **Route Guards**: Proteção de rotas autenticadas
- ✅ **HTTP Interceptors**: Adição automática de tokens JWT
- ✅ **Gráficos Interativos**: Chart.js integrado

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

- ✅ Construir as imagens do frontend e backend
- ✅ Inicializar o PostgreSQL
- ✅ Executar as migrations automaticamente
- ✅ Popular o banco com dados de exemplo (seeds)
- ✅ Iniciar todos os serviços

3. **Acesse a aplicação**

| Serviço      | URL                            | Descrição                      |
| ------------ | ------------------------------ | ------------------------------ |
| Frontend     | http://localhost:4200          | Interface do usuário           |
| Backend API  | http://localhost:3000          | API REST                       |
| Swagger Docs | http://localhost:3000/api/docs | Documentação interativa da API |

4. **Credenciais de acesso**

```
Email: admin@example.com
Senha: admin123
Role: ADMIN (acesso completo)
```

### Comandos Úteis

```bash
# Ver logs em tempo real
docker compose logs -f

# Ver logs de um serviço específico
docker compose logs -f backend
docker compose logs -f frontend

# Parar os containers
docker compose down

# Parar e remover volumes (reset completo do banco)
docker compose down -v

# Reiniciar serviços
docker compose restart

# Acessar shell do backend
docker compose exec backend sh

# Executar migrations manualmente
docker compose exec backend npm run migration:run

# Executar seeds manualmente (com reset)
docker compose exec backend npm run seed:run -- --reset
```

## 💻 Desenvolvimento Local (sem Docker)

### Backend

```bash
cd backend
npm install

# Configurar .env (copiar de .env.example)
cp .env.example .env

# Executar migrations
npm run migration:run

# Executar seeds
npm run seed:run

# Iniciar em modo desenvolvimento
npm run start:dev
```

### Frontend

```bash
cd frontend
npm install

# Iniciar servidor de desenvolvimento
npm start
```

**Acesso:**

- Frontend: http://localhost:4200
- Backend: http://localhost:3000

## 🧪 Testes da API

### Swagger UI (Recomendado)

Acesse http://localhost:3000/api/docs para testar todos os endpoints interativamente.

### Arquivo openapi.json

O projeto inclui um arquivo `openapi.json` na raiz que contém a especificação completa da API no formato OpenAPI 3.0. Este arquivo pode ser usado para:

1. **Importar no Postman:**

   - Abra o Postman
   - File → Import
   - Selecione o arquivo `openapi.json`
   - Todos os endpoints serão importados automaticamente

2. **Importar no Insomnia:**

   - Abra o Insomnia
   - Application → Preferences → Data → Import Data
   - Selecione o arquivo `openapi.json`

3. **Gerar clientes automaticamente:**

   ```bash
   # Exemplo com openapi-generator
   openapi-generator-cli generate -i openapi.json -g typescript-axios -o ./client
   ```

4. **Validar a API:**
   ```bash
   # Usando swagger-cli
   swagger-cli validate openapi.json
   ```

### Exemplos de Requisições

**Login:**

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }'
```

**Listar Clientes (com token):**

```bash
curl -X GET http://localhost:3000/clients?page=1&limit=10 \
  -H "Authorization: Bearer SEU_TOKEN_JWT"
```

**Criar Transação:**

```bash
curl -X POST http://localhost:3000/transactions \
  -H "Authorization: Bearer SEU_TOKEN_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "kind": "RECEIVABLE",
    "status": "PENDING",
    "description": "Venda de produto",
    "amount": 1500.00,
    "dueDate": "2025-11-30",
    "clientId": "uuid-do-cliente"
  }'
```

## 📊 Banco de Dados

### Modelo de Dados

**users**

- `id` (UUID, PK)
- `username` (string, unique)
- `email` (string, unique)
- `password` (string, hashed)
- `role` (enum: USER, ADMIN)
- `isActive` (boolean)
- `createdAt`, `updatedAt`, `deletedAt`

**clients**

- `id` (UUID, PK)
- `name` (string)
- `email` (string, unique)
- `phone` (string, nullable)
- `document` (string, nullable)
- `address` (string, nullable)
- `createdAt`, `updatedAt`, `deletedAt`

**transactions**

- `id` (UUID, PK)
- `kind` (enum: PAYABLE, RECEIVABLE)
- `status` (enum: PENDING, PAID, OVERDUE, CANCELLED)
- `description` (string)
- `amount` (decimal)
- `dueDate` (date)
- `paymentDate` (date, nullable)
- `clientId` (UUID, FK, nullable)
- `notes` (text, nullable)
- `createdAt`, `updatedAt`, `deletedAt`

### Migrations

As migrations são executadas automaticamente ao iniciar os containers. Migrations disponíveis:

1. `CreateUsers` - Cria tabela de usuários
2. `CreateClients` - Cria tabela de clientes
3. `CreateTransactions` - Cria tabela de transações
4. `AddRoleToUsers` - Adiciona campo role aos usuários

### Seeds

O arquivo `backend/src/database/seeds/seed.ts` popula o banco com dados de exemplo:

- ✅ 1 usuário admin (admin@example.com / admin123)
- ✅ 3 clientes de exemplo
- ✅ 20 transações (mix de contas a pagar e receber)
- ✅ Transações com diferentes status e datas
- ✅ Período de dados: 01/09/2025 a 28/10/2025

**Executar seeds:**

```bash
# Com reset (limpa dados existentes)
docker compose exec backend npm run seed:run -- --reset

# Sem reset (adiciona aos dados existentes)
docker compose exec backend npm run seed:run
```

## 📚 Documentação da API

### Swagger UI

**URL:** http://localhost:3000/api/docs

A documentação Swagger oferece:

- ✅ Lista completa de endpoints
- ✅ Schemas de request/response
- ✅ Teste interativo de endpoints
- ✅ Exemplos de uso
- ✅ Códigos de status HTTP
- ✅ Autenticação JWT integrada

### Principais Endpoints

#### Autenticação

- `POST /auth/register` - Registrar novo usuário
- `POST /auth/login` - Fazer login e obter token JWT

#### Clientes

- `GET /clients` - Listar clientes (paginação, busca)
- `GET /clients/:id` - Buscar cliente por ID
- `POST /clients` - Criar novo cliente 🔒 ADMIN
- `PATCH /clients/:id` - Atualizar cliente
- `DELETE /clients/:id` - Remover cliente 🔒 ADMIN

#### Transações

- `GET /transactions` - Listar transações (filtros: kind, status, clientId, from, to)
- `GET /transactions/:id` - Buscar transação por ID
- `POST /transactions` - Criar nova transação 🔒 ADMIN
- `PATCH /transactions/:id` - Atualizar transação
- `POST /transactions/:id/pay` - Marcar como paga
- `DELETE /transactions/:id` - Remover transação 🔒 ADMIN

#### Relatórios

- `GET /reports/summary` - Resumo financeiro consolidado
- `GET /reports/cashflow?from=YYYY-MM-DD&to=YYYY-MM-DD` - Fluxo de caixa por período

## 🔐 Segurança

### Autenticação e Autorização

- ✅ JWT com tokens de expiração (1 dia padrão)
- ✅ Senhas criptografadas com bcrypt (10 rounds)
- ✅ Sistema de roles (ADMIN/USER)
- ✅ Guards para proteção de rotas
- ✅ Decorators customizados (@Roles, @Public)

### Validação

- ✅ class-validator em todos os DTOs
- ✅ Validação de entrada em todos os endpoints
- ✅ Sanitização de dados
- ✅ Validação de tipos TypeScript

### Boas Práticas

- ✅ CORS configurado
- ✅ Exception handling centralizado
- ✅ Soft delete para preservação de dados
- ✅ Logs estruturados
- ✅ Variáveis de ambiente para secrets

**⚠️ Importante:** As credenciais padrão são apenas para desenvolvimento. Em produção:

- Altere todas as senhas
- Use variáveis de ambiente seguras
- Configure HTTPS
- Implemente rate limiting
- Configure CORS restritivo

## 🎨 Interface do Usuário

### Páginas Disponíveis

1. **Login** (`/login`)

   - Formulário de autenticação
   - Validação de campos
   - Feedback de erros

2. **Registro** (`/register`)

   - Cadastro de novos usuários
   - Validação de email único
   - Confirmação de senha

3. **Dashboard** (`/dashboard`)

   - Resumo financeiro em cards
   - Indicadores visuais
   - Acesso rápido às funcionalidades
   - Link para relatórios

4. **Clientes** (`/clients`)

   - Listagem com paginação
   - Busca por nome
   - CRUD completo via modais
   - Confirmação de exclusão

5. **Contas a Receber** (`/receivables`)

   - Listagem com paginação avançada
   - Filtros por status, cliente e período
   - CRUD completo
   - Ação de quitação

6. **Contas a Pagar** (`/payables`)

   - Listagem com paginação avançada
   - Filtros por status, cliente e período
   - CRUD completo
   - Ação de quitação

7. **Relatórios** (`/reports`)
   - Filtro de período obrigatório
   - Gráficos interativos (Chart.js)
   - Cards de resumo financeiro
   - Tabela detalhada de transações
   - Função de impressão

### Componentes Reutilizáveis

- **Header**: Navegação principal com menu responsivo
- **Card**: Container estilizado para conteúdo
- **Button**: Botões com variantes (primary, secondary, danger)
- **Alert**: Mensagens de feedback (success, error, warning)
- **Modal**: Diálogos para criação e edição
- **Table**: Tabela com paginação completa
- **SearchInput**: Campo de busca com debounce

## 🐳 Docker

### Estrutura

O projeto utiliza Docker Compose com 3 serviços:

1. **postgres** - PostgreSQL 16 Alpine

   - Porta: 5432
   - Volume: postgres_data
   - Health check configurado

2. **backend** - API NestJS

   - Porta: 3000
   - Depende do postgres
   - Executa migrations e seeds automaticamente

3. **frontend** - Angular + Nginx
   - Porta: 4200
   - Build otimizado para produção
   - Nginx configurado

### Variáveis de Ambiente

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

- `mini-erp-network` - Rede bridge isolada

## 🚨 Troubleshooting

### Porta já em uso

```bash
# Verificar processos
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
# Limpar e reconstruir
docker compose down -v
sudo rm -rf backend/node_modules frontend/node_modules
docker compose up -d --build
```

### Banco de dados não conecta

```bash
# Verificar status
docker compose ps postgres
docker compose logs postgres

# Reiniciar
docker compose restart postgres
```

### Gráficos não aparecem

```bash
# Verificar instalação
cd frontend
npm list chart.js ng2-charts

# Reinstalar se necessário
npm install chart.js ng2-charts --save --legacy-peer-deps

# Rebuild
docker compose up -d --build frontend
```

## 📝 Qualidade de Código

### Clean Code

- ✅ Nomes descritivos e significativos
- ✅ Funções pequenas e com responsabilidade única
- ✅ Código auto-explicativo
- ✅ Formatação consistente com Prettier
- ✅ Princípio DRY (Don't Repeat Yourself)
- ✅ Comentários apenas quando necessário

### SOLID

- ✅ **Single Responsibility**: Cada classe/módulo tem uma única responsabilidade
- ✅ **Open/Closed**: Aberto para extensão, fechado para modificação
- ✅ **Liskov Substitution**: Uso correto de herança e interfaces
- ✅ **Interface Segregation**: Interfaces específicas e coesas
- ✅ **Dependency Inversion**: Dependência de abstrações via injeção

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

## 🎓 Decisões Técnicas

### Por que NestJS?

- Arquitetura modular e escalável
- TypeScript nativo com decorators
- Dependency Injection robusto
- Excelente integração com TypeORM
- Documentação automática com Swagger
- Suporte a Guards e Interceptors

### Por que Angular 18?

- Framework completo e opinativo
- Standalone components (sem NgModules)
- TypeScript nativo
- Dependency Injection
- RxJS para programação reativa
- Excelente tooling e CLI

### Por que TypeORM?

- Migrations para versionamento do banco
- Suporte a relacionamentos complexos
- Query builder type-safe
- Soft delete nativo
- Decorators intuitivos

### Por que Chart.js?

- Biblioteca leve e performática
- Gráficos responsivos
- Customização completa
- Boa integração com Angular (ng2-charts)
- Documentação excelente

### Por que Docker?

- Ambiente consistente entre dev e produção
- Fácil setup (um comando para rodar tudo)
- Isolamento de dependências
- Facilita deploy e escalabilidade

## 📦 Estrutura Completa do Projeto

```
mini-ERP-financeiro/
├── backend/
│   ├── src/
│   │   ├── auth/
│   │   │   ├── decorators/
│   │   │   ├── guards/
│   │   │   ├── enums/
│   │   │   └── strategies/
│   │   ├── clients/
│   │   │   ├── dto/
│   │   │   ├── entities/
│   │   │   └── clients.service.ts
│   │   ├── transactions/
│   │   │   ├── dto/
│   │   │   ├── entities/
│   │   │   ├── enums/
│   │   │   └── transactions.service.ts
│   │   ├── reports/
│   │   ├── users/
│   │   ├── common/
│   │   ├── config/
│   │   └── database/
│   │       ├── migrations/
│   │       └── seeds/
│   ├── Dockerfile
│   ├── Dockerfile.dev
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   └── app/
│   │       ├── core/
│   │       │   ├── guards/
│   │       │   ├── interceptors/
│   │       │   ├── models/
│   │       │   └── services/
│   │       ├── shared/
│   │       │   └── components/
│   │       └── features/
│   │           ├── auth/
│   │           ├── dashboard/
│   │           ├── clients/
│   │           ├── receivables/
│   │           ├── payables/
│   │           └── reports/
│   ├── Dockerfile
│   ├── Dockerfile.dev
│   ├── nginx.conf
│   ├── package.json
│   ├── angular.json
│   └── tailwind.config.js
│
├── .github/
│   └── workflows/
│       └── ci.yml
├── docker-compose.yml
├── openapi.json
├── API_TESTING.md
└── README.md
```

## 📄 Licença

MIT

---

## 👨‍💻 Sobre o Desenvolvimento

**Projeto de Teste Técnico - Desenvolvedor Fullstack**

Este projeto foi desenvolvido como avaliação técnica, demonstrando:

- ✅ Domínio de tecnologias fullstack modernas
- ✅ Aplicação de boas práticas de engenharia de software
- ✅ Capacidade de criar soluções completas e escaláveis
- ✅ Conhecimento em arquitetura de software
- ✅ Experiência com DevOps e containerização

**Desenvolvido com ❤️ usando as melhores práticas de desenvolvimento fullstack**

🚀 **Stack:** NestJS + Angular + PostgreSQL + Docker + Chart.js
