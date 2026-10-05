# Desafio Técnico — Target Sistemas

## Descrição

Solução para o desafio técnico da Target Sistemas, implementando três funcionalidades: cálculo de comissão de vendedores, controle de movimentação de estoque e cálculo de juros por atraso.

## Tecnologias

- C# / .NET 8
- Console Application
- `System.Text.Json` (leitura de JSON)
- xUnit (testes unitários)

## Estrutura

```
DesafioTarget/
├── src/DesafioTarget/
│   ├── Data/
│   │   ├── vendas.json
│   │   └── estoque.json
│   ├── Models/
│   │   ├── Sale.cs
│   │   ├── Product.cs
│   │   ├── StockMovement.cs
│   │   └── MovementType.cs
│   ├── Services/
│   │   ├── CommissionService.cs
│   │   ├── InventoryService.cs
│   │   └── InterestService.cs
│   └── Program.cs
├── tests/DesafioTarget.Tests/
│   ├── CommissionServiceTests.cs
│   ├── InventoryServiceTests.cs
│   └── InterestServiceTests.cs
└── DesafioTarget.sln
```

## Funcionalidades

1. **Cálculo de comissões** — lê `vendas.json`, agrupa por vendedor e exibe uma tabela formatada com total de vendas e comissão.
2. **Movimentação de estoque** — lê `estoque.json`, permite entrada e saída de produtos com validações completas.
3. **Cálculo de juros** — recebe valor e data de vencimento, calcula juros simples de 2,5% ao dia.
4. **Histórico da sessão** — registra todas as movimentações realizadas na sessão atual e permite consultá-las a qualquer momento.

## Regras de negócio

### Comissão

| Valor da venda        | Comissão |
|-----------------------|----------|
| Abaixo de R$ 100,00   | 0%       |
| R$ 100,00 a R$ 499,99 | 1%       |
| R$ 500,00 ou mais     | 5%       |

### Estoque

- **Entrada:** aumenta o estoque do produto.
- **Saída:** diminui o estoque; rejeitada se o resultado for negativo.
- Produto inexistente, quantidade inválida e ID duplicado são rejeitados com mensagem clara.

### Juros

- Taxa: **2,5% ao dia** (juros simples: `valor × 0,025 × dias de atraso`).
- Sem juros se o vencimento for hoje ou estiver no futuro.
- Considera apenas dias completos de atraso.

## Decisões técnicas

- **`decimal` para dinheiro** — evita erros de arredondamento de ponto flutuante.
- **Juros simples** — dias de atraso calculados via `DateOnly.DayNumber`, garantindo apenas dias inteiros sem ambiguidade de horário.
- **Validações sem exceções** — `InventoryService` retorna um record `MovementResult` com `Succeeded`, `Message` e `FinalStock`, mantendo o fluxo da aplicação previsível.
- **JSON com atributos explícitos** — propriedades mapeadas com `[JsonPropertyName]`, sem depender de `PropertyNameCaseInsensitive`.
- **JsonSerializerOptions como campo estático** — evita alocação desnecessária a cada deserialização.
- **Parsing tolerante de decimal** — aceita tanto vírgula (`1000,50`) quanto ponto (`1000.50`) como separador decimal.
- **Histórico de movimentações** — `InventoryService` mantém o registro da sessão em memória, disponível para consulta sem acoplamento com o `Program.cs`.
- **Arquitetura proporcional** — sem repositórios, interfaces ou camadas desnecessárias.

## Como executar

```bash
dotnet restore
dotnet build
dotnet test
dotnet run --project src/DesafioTarget
```

## Cumprimento dos Requisitos (DOCX)

Todo o desenvolvimento foi baseado nos requisitos do arquivo original do desafio. 

1. **Questão 1: Comissões**
   - **Regra:** Ler dados, < R (0%), < R (1%), >= R (5%).
   - **Entregue:** CommissionService faz a leitura do arquivo endas.json, realiza os cálculos exatos por faixa e agrupa por vendedor. A CLI formata os dados em tabela.

2. **Questão 2: Movimentação de Estoque**
   - **Regra:** Permitir entrada/saída usando estoque.json, gerar ID único, obter descrição do tipo e retornar quantidade final.
   - **Entregue:** InventoryService processa as movimentações. IDs únicos são gerados nativamente por Guid.NewGuid(). Validações estritas impedem estoque negativo e duplicações. O histórico da sessão é mantido em memória.

3. **Questão 3: Cálculo de Juros**
   - **Regra:** A partir de valor e vencimento, calcular juros na data de hoje considerando multa de 2,5% ao dia.
   - **Entregue:** InterestService calcula diferença de dias usando DateOnly.FromDateTime(DateTime.Today) contra a data de vencimento e aplica juros simples, isentando juros para datas futuras/hoje.
