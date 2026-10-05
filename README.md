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

O projeto está organizado em uma arquitetura limpa e desacoplada:

1. **`DesafioTarget.Core` (Class Library - .NET):**
   - Centraliza todas as regras de negócio, cálculos financeiros (juros/multas), controle de comissões e movimentação de inventário.
   - Totalmente desacoplada de interfaces de usuário ou frameworks.

2. **`DesafioTarget.Api` (Minimal API - .NET):**
   - Endpoints RESTful de alta performance com suporte a CORS.
   - Documentação interativa integrada com Swagger/OpenAPI.

3. **`DesafioTarget.App` (Console CLI - .NET):**
   - Interface interativa de linha de comando com menus amigáveis para execução de todas as tarefas.

4. **`DesafioTarget.Tests` (xUnit Tests):**
   - Cobertura de testes unitários automatizados validando cálculos e integridade das regras de negócio.

5. **`frontend` (Dashboard Web SPA):**
   - Desenvolvido com **Vite + Vanilla TypeScript** e CSS moderno.
   - Componentização limpa, design system responsivo com suporte a dispositivos móveis e ícones SVG.
   - Fallback de demonstração integrado para visualização fluida na web.

---

## 🚀 Como Executar Localmente

### Pré-requisitos
- [.NET SDK 8.0+](https://dotnet.microsoft.com/download)
- [Node.js 18+](https://nodejs.org/)

---

### 1. Rodar a API Backend (.NET)
Em um terminal na raiz do projeto:
```bash
dotnet restore
dotnet run --project src/DesafioTarget.Api
```
A API estará rodando em `http://localhost:5068` (Swagger disponível em `http://localhost:5068/swagger`).

---

### 2. Rodar o Frontend Web (TypeScript + Vite)
Em outro terminal:
```bash
cd frontend
npm install
npm run dev
```
Abra o navegador em `http://localhost:5173`.

---

### 3. Executar o Console Interativo (CLI)
Caso queira testar diretamente pelo terminal:
```bash
dotnet run --project src/DesafioTarget.App
```

---

### 4. Executar os Testes Automatizados
```bash
dotnet test
```

---

## 📡 Endpoints da API

| Método | Rota | Descrição |
| :--- | :--- | :--- |
| `GET` | `/api/commissions` | Retorna o total de vendas e comissões calculadas por vendedor |
| `GET` | `/api/inventory` | Consulta o estoque atualizado de todos os produtos |
| `POST` | `/api/inventory/movement` | Realiza movimentações de entrada ou saída no estoque |
| `POST` | `/api/interest` | Calcula juros, multa e montante total por dias de atraso |

---

## 🛠️ Tecnologias Utilizadas
- **Backend:** C#, .NET 8, ASP.NET Core Minimal APIs, Swagger, xUnit.
- **Frontend:** TypeScript, Vite, CSS3 Moderno (Flexbox / Grid / CSS Variables), SVG Icons.
- **Deploy:** Cloudflare Pages & GitHub Actions CI.
