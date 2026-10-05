# Desafio Técnico — Target Sistemas

> **🚀 Aplicação em Produção (Live Demo):** [https://desafiotarget.pages.dev/](https://desafiotarget.pages.dev/)

Este repositório contém a solução completa para o desafio técnico da Target Sistemas, desenvolvida com foco em excelência técnica, código limpo, componentização e arquitetura moderna.

---

## 🌐 Links Rápidos
- **Frontend em Produção:** [https://desafiotarget.pages.dev/](https://desafiotarget.pages.dev/)
- **API Local (.NET):** `http://localhost:5068/swagger`
- **Frontend Local (Vite):** `http://localhost:5173`

---

## 🏛️ Arquitetura da Solução

O projeto está organizado com uma separação clara entre **Backend** e **Frontend**:

```
├── backend/
│   ├── src/
│   │   ├── DesafioTarget/        # Aplicação Interativa Console CLI
│   │   ├── DesafioTarget.Api/    # ASP.NET Core Minimal API + Swagger
│   │   └── DesafioTarget.Core/   # Biblioteca de Regras de Negócio e Serviços
│   ├── tests/
│   │   └── DesafioTarget.Tests/  # 22 Testes Unitários Automatizados (xUnit)
│   └── DesafioTarget.sln         # Solução .NET
├── frontend/                     # SPA em TypeScript + Vite (Identidade Target Sistemas)
└── README.md
```

### 1. `backend/src/DesafioTarget.Core` (Regras de Negócio)
- Centraliza toda a lógica de negócio, apuração de comissões por vendedor, controle de estoque (entradas/saídas com validações) e cálculo de juros diários (2,5% ao dia).

### 2. `backend/src/DesafioTarget.Api` (API RESTful)
- Endpoints de alta performance com suporte a CORS, documentação OpenAPI/Swagger e validações rigorosas de entrada.

### 3. `backend/src/DesafioTarget` (Console CLI)
- Interface de linha de comando interativa para execução direta de todos os desafios no terminal.

### 4. `backend/tests/DesafioTarget.Tests` (Testes xUnit)
- Bateria de **22 testes unitários** automatizados cobrindo todos os cenários de sucesso e exceções.

### 5. `frontend` (Dashboard Web SPA)
- Desenvolvido com **Vite + Vanilla TypeScript** e CSS moderno.
- Identidade visual autêntica da **Target Sistemas**, logo oficial, navegação interativa por abas (`Gestão`, `Comercial`, `Logística`, `Fiscal / Financeiro`), busca por vendedor e formulário de movimentação em tempo real.

---

## 🚀 Como Executar Localmente

### Pré-requisitos
- [.NET SDK 8.0+](https://dotnet.microsoft.com/download)
- [Node.js 18+](https://nodejs.org/)

---

### 1. Rodar a API Backend (.NET)
Em um terminal na raiz do projeto:
```bash
cd backend
dotnet restore
dotnet run --project src/DesafioTarget.Api
```
A API estará rodando em `http://localhost:5068` (Swagger disponível em `http://localhost:5068/swagger`).

---

### 2. Rodar o Console Interativo (CLI)
Para executar diretamente o menu interativo no terminal:
```bash
cd backend
dotnet run --project src/DesafioTarget
```

---

### 3. Executar os Testes Automatizados
```bash
cd backend
dotnet test
```

---

### 4. Rodar o Frontend Web (TypeScript + Vite)
Em outro terminal:
```bash
cd frontend
npm install
npm run dev
```
Abra o navegador em `http://localhost:5173`.

---

## 📡 Endpoints da API

| Método | Rota | Descrição |
| :--- | :--- | :--- |
| `GET` | `/api/commissions` | Retorna o total de vendas e comissões calculadas por vendedor |
| `GET` | `/api/inventory` | Consulta o estoque atualizado de todos os produtos |
| `POST` | `/api/inventory/movement` | Realiza movimentações de entrada (+) ou saída (-) no estoque |
| `POST` | `/api/interest` | Calcula juros por dias de atraso e montante total |

---

## 🛠️ Tecnologias Utilizadas
- **Backend:** C#, .NET 8, ASP.NET Core Minimal APIs, Swagger, xUnit.
- **Frontend:** TypeScript, Vite, CSS3 Moderno (Design System Target Sistemas), SVG Icons.
- **Deploy:** Cloudflare Pages & GitHub Actions CI.
