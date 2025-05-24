# 🔐 Gerador de Senhas - Back-End

API desenvolvida para geração e gestão de senhas, utilizando Node.js, Express e Prisma ORM, com banco de dados PostgreSQL.

---

## ✅ Versões utilizadas

- **Node.js:** v22.14.0 (ou superior)  
- **Gerenciador de pacotes:** npm v10.9.2 


## 🚀 Inicialização dos Projetos

### 🖥️ Back-End

1. **Clone o repositório:**
```bash
git clone https://github.com/Icaleb1/gerador-senhas-mobile-back.git
```
2. **Acesse a pasta do projeto:**
```bash
cd gerador-senhas-mobile-back
```
3. Instale as dependências:
```bash
npm install
```
4. Crie o arquivo .env na raiz do projeto com o seguinte conteúdo (ajuste conforme seu ambiente):
```bash
DATABASE_URL="postgresql://usuario:senha@localhost:5432/nome_do_banco?schema=public"
JWT_SECRET="sua_chave_secreta"
JWT_EXPIRES_IN="1h"
SECRET_KEY="sua_segunda_chave_secreta"
PORT=3000
```
5. Configure o banco de dados:
# Crie um banco PostgreSQL local.
# Atualize a variável DATABASE_URL no arquivo .env com as credenciais corretas.

6. Execute as migrações do Prisma para criar as tabelas no banco de dados:
```bash
npx prisma migrate dev
```
7. Acesse a pasta src:
```bash
cd src
```
8. Inicie o servidor:
```bash
node index.js
```