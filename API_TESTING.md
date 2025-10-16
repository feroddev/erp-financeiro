# Testando a API - Mini ERP Financeiro

## 📁 Arquivo OpenAPI/Swagger

O arquivo `openapi.json` está na raiz do projeto e pode ser importado em:
- **Postman**
- **Insomnia**
- **Thunder Client** (VS Code)
- **Bruno**
- Qualquer ferramenta compatível com OpenAPI 3.0

## 🚀 Fluxo de Teste Completo

### 1. Login (Obter Token JWT)

**Endpoint:** `POST http://localhost:3000/auth/login`

**Body (JSON):**
```json
{
  "emailOrUsername": "admin@example.com",
  "password": "admin123"
}
```

**Resposta:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Copie o `access_token` para usar nos próximos requests!**

---

### 2. Listar Clientes

**Endpoint:** `GET http://localhost:3000/clients`

**Headers:**
```
Authorization: Bearer SEU_TOKEN_AQUI
```

**Resposta:** Lista com 3 clientes criados pelos seeds

---

### 3. Criar Novo Cliente

**Endpoint:** `POST http://localhost:3000/clients`

**Headers:**
```
Authorization: Bearer SEU_TOKEN_AQUI
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "name": "Maria Santos",
  "email": "maria@example.com",
  "phone": "(11) 98765-4321",
  "document": "123.456.789-00",
  "address": "Rua das Flores, 123 - São Paulo, SP"
}
```

---

### 4. Listar Transações

**Endpoint:** `GET http://localhost:3000/transactions`

**Headers:**
```
Authorization: Bearer SEU_TOKEN_AQUI
```

**Query Parameters (opcionais):**
- `kind=RECEIVABLE` ou `PAYABLE`
- `status=PENDING` ou `PAID` ou `OVERDUE` ou `CANCELLED`
- `from=2025-01-01`
- `to=2025-01-31`
- `page=1`
- `limit=10`

**Exemplo:**
```
GET http://localhost:3000/transactions?kind=RECEIVABLE&status=PENDING
```

---

### 5. Criar Nova Transação

**Endpoint:** `POST http://localhost:3000/transactions`

**Headers:**
```
Authorization: Bearer SEU_TOKEN_AQUI
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "kind": "RECEIVABLE",
  "status": "PENDING",
  "description": "Pagamento de serviços - Janeiro",
  "amount": 1500.00,
  "dueDate": "2025-01-15",
  "notes": "Cliente solicitou desconto de 5%"
}
```

**Com cliente associado:**
```json
{
  "kind": "PAYABLE",
  "description": "Fornecedor de materiais",
  "amount": 800.00,
  "dueDate": "2025-01-20",
  "clientId": "UUID_DO_CLIENTE_AQUI"
}
```

---

### 6. Marcar Transação como Paga

**Endpoint:** `POST http://localhost:3000/transactions/{id}/pay`

**Headers:**
```
Authorization: Bearer SEU_TOKEN_AQUI
Content-Type: application/json
```

**Body (JSON) - Opcional:**
```json
{
  "paymentDate": "2025-01-15"
}
```

Se não enviar `paymentDate`, usa a data atual.

---

### 7. Relatório de Fluxo de Caixa

**Endpoint:** `GET http://localhost:3000/reports/cashflow`

**Headers:**
```
Authorization: Bearer SEU_TOKEN_AQUI
```

**Query Parameters (obrigatórios):**
```
from=2025-01-01&to=2025-01-31
```

**Exemplo completo:**
```
GET http://localhost:3000/reports/cashflow?from=2025-01-01&to=2025-01-31
```

---

## 🔧 Testando com cURL

### Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"emailOrUsername":"admin@example.com","password":"admin123"}'
```

### Listar Clientes (com token)
```bash
curl -X GET http://localhost:3000/clients \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

### Criar Cliente
```bash
curl -X POST http://localhost:3000/clients \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@example.com",
    "phone": "(11) 98765-4321"
  }'
```

### Criar Transação
```bash
curl -X POST http://localhost:3000/transactions \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "kind": "RECEIVABLE",
    "description": "Pagamento de serviços",
    "amount": 1500.00,
    "dueDate": "2025-01-15"
  }'
```

---

## 📊 Swagger UI (Recomendado)

A forma mais fácil de testar é usando o Swagger UI integrado:

**Acesse:** http://localhost:3000/api/docs

### Como usar:
1. Acesse o Swagger UI
2. Vá até `/auth/login` e clique em "Try it out"
3. Execute o login com:
   ```json
   {
     "emailOrUsername": "admin@example.com",
     "password": "admin123"
   }
   ```
4. Copie o `access_token` da resposta
5. Clique no botão **"Authorize"** no topo da página
6. Cole o token (sem "Bearer")
7. Clique em "Authorize"
8. Agora você pode testar todos os endpoints protegidos!

---

## 🔑 Credenciais de Teste

**Usuário Admin:**
- Email: `admin@example.com`
- Senha: `admin123`

**Banco de Dados:**
- Host: `localhost`
- Port: `5432`
- Database: `mini_erp`
- Username: `postgres`
- Password: `postgres`

---

## 📝 Dados de Exemplo (criados pelos seeds)

### Clientes:
1. João Silva - joao.silva@example.com
2. Maria Santos - maria.santos@example.com
3. Empresa XYZ Ltda - contato@empresaxyz.com

### Transações:
- 6 transações de exemplo com diferentes status (PAID, PENDING, OVERDUE)
- Tipos: RECEIVABLE (a receber) e PAYABLE (a pagar)

---

## 🎯 Importar no Postman

1. Abra o Postman
2. Clique em "Import"
3. Selecione o arquivo `openapi.json`
4. Todas as rotas serão importadas automaticamente
5. Configure a variável de ambiente `baseUrl` como `http://localhost:3000`
6. Configure a variável `token` após fazer login

---

## 🐛 Troubleshooting

### Erro 401 (Unauthorized)
- Verifique se o token está correto
- Verifique se adicionou "Bearer " antes do token
- O token expira em 1 dia, faça login novamente

### Erro 404 (Not Found)
- Verifique se a URL está correta
- Verifique se o backend está rodando: `docker compose ps`

### Erro 500 (Internal Server Error)
- Verifique os logs: `docker compose logs backend`
- Verifique se o banco de dados está rodando
