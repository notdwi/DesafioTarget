# Desafio Técnico — Target Sistemas (Premium Edition)

## Arquitetura da Solução

O projeto evoluiu para uma arquitetura profissional de mercado:

1. **Backend (API + Core):** 
   - Lógica extraída para um **Class Library** (DesafioTarget.Core), isolando regras de negócio, e processamento de JSON.
   - Uma **Minimal API em .NET 8** (DesafioTarget.Api) servindo os dados com endpoints limpos e suporte a CORS.
2. **Frontend (Dashboard):**
   - Aplicação modular feita em **Vite + Vanilla TypeScript**.
   - Design System próprio (*Glassmorphism*, Dark Mode, Responsivo).
   - Componentização lógica sem uso de frameworks pesados (React/Angular), provando domínio puro da linguagem TS.

## Como executar

### 1. Iniciar a API (.NET)
Abra o terminal e rode:
`ash
dotnet restore
dotnet run --project src/DesafioTarget.Api
`
A API ficará disponível em http://localhost:5068.

### 2. Iniciar o Frontend (Dashboard)
Em outro terminal:
`ash
cd frontend
npm install
npm run dev
`
Acesse http://localhost:5173 no seu navegador.
