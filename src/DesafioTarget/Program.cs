using System.Globalization;
using DesafioTarget.Models;
using DesafioTarget.Services;

var dataDir = Path.Combine(AppContext.BaseDirectory, "Data");
var salesPath = Path.Combine(dataDir, "vendas.json");
var inventoryPath = Path.Combine(dataDir, "estoque.json");

var commissionService = new CommissionService();
var inventoryService = InventoryService.LoadFromJson(inventoryPath);
var interestService = new InterestService();

while (true)
{
    PrintMenu();
    var option = Console.ReadLine()?.Trim();

    switch (option)
    {
        case "1": RunCommissions(commissionService, salesPath); break;
        case "2": RunInventory(inventoryService); break;
        case "3": RunInterest(interestService); break;
        case "4": RunMovementHistory(inventoryService); break;
        case "0":
            Write("\nEncerrando. Até logo!\n", ConsoleColor.Cyan);
            return;
        default:
            WriteError("Opção inválida. Tente novamente.");
            break;
    }

    Console.WriteLine("\nPressione qualquer tecla para continuar...");
    Console.ReadKey();
    Console.Clear();
}

// ── Menu ────────────────────────────────────────────────────────────────────

static void PrintMenu()
{
    Write("╔══════════════════════════════════════╗\n", ConsoleColor.Cyan);
    Write("║          DESAFIO TARGET               ║\n", ConsoleColor.Cyan);
    Write("╚══════════════════════════════════════╝\n", ConsoleColor.Cyan);
    Console.WriteLine();
    Console.WriteLine("  1. Calcular comissões");
    Console.WriteLine("  2. Movimentar estoque");
    Console.WriteLine("  3. Calcular juros");
    Console.WriteLine("  4. Histórico de movimentações");
    Console.WriteLine("  0. Sair");
    Console.WriteLine();
    Console.Write("Selecione uma opção: ");
}

// ── Commissions ─────────────────────────────────────────────────────────────

static void RunCommissions(CommissionService service, string salesPath)
{
    PrintSectionHeader("COMISSÕES POR VENDEDOR");

    if (!File.Exists(salesPath))
    {
        WriteError("Arquivo de vendas não encontrado.");
        return;
    }

    var summaries = service.GetCommissionsBySalesperson(service.LoadSales(salesPath)).ToList();

    if (summaries.Count == 0)
    {
        Console.WriteLine("Nenhuma venda encontrada.");
        return;
    }

    int nameWidth = Math.Max(summaries.Max(s => s.Salesperson.Length), "Vendedor".Length);

    PrintTableRow("Vendedor", "Total Vendas", "Comissão", nameWidth);
    Write(new string('─', nameWidth + 32) + "\n", ConsoleColor.DarkGray);

    foreach (var summary in summaries)
    {
        Console.Write($"  {summary.Salesperson.PadRight(nameWidth)}");
        Console.Write($"  {summary.TotalSales,14:C}");
        Write($"  {summary.TotalCommission,12:C}\n", ConsoleColor.Green);
    }
}

static void PrintTableRow(string name, string col2, string col3, int nameWidth)
{
    Write($"  {name.PadRight(nameWidth)}  {"Total Vendas",14}  {"Comissão",12}\n", ConsoleColor.DarkGray);
}

// ── Inventory ────────────────────────────────────────────────────────────────

static void RunInventory(InventoryService service)
{
    PrintSectionHeader("MOVIMENTAÇÃO DE ESTOQUE");

    Console.WriteLine("  Produtos disponíveis:\n");
    foreach (var product in service.Products)
        Console.WriteLine($"    [{product.Code}] {product.Description.PadRight(30)} Estoque: {product.Stock}");

    Console.WriteLine();

    int code;
    while (true)
    {
        Console.Write("  Código do produto (ou 0 para cancelar): ");
        var input = Console.ReadLine()?.Trim();
        if (input == "0") return;

        if (!int.TryParse(input, out code))
        {
            WriteError("Código inválido. Tente novamente.\n");
            continue;
        }

        if (!service.Products.Any(p => p.Code == code))
        {
            WriteError($"Produto com código {code} não encontrado. Tente novamente.\n");
            continue;
        }
        break;
    }

    MovementType type;
    while (true)
    {
        Console.Write("  Tipo (1=Entrada / 2=Saída): ");
        var typeInput = Console.ReadLine()?.Trim();
        if (typeInput == "1") { type = MovementType.Inbound; break; }
        if (typeInput == "2") { type = MovementType.Outbound; break; }
        WriteError("Tipo de movimentação inválido. Use 1 para Entrada ou 2 para Saída.\n");
    }

    string description;
    while (true)
    {
        Console.Write("  Descrição: ");
        description = Console.ReadLine() ?? string.Empty;
        if (!string.IsNullOrWhiteSpace(description)) break;
        WriteError("A descrição não pode ser vazia. Tente novamente.\n");
    }

    int quantity;
    while (true)
    {
        Console.Write("  Quantidade: ");
        if (int.TryParse(Console.ReadLine(), out quantity) && quantity > 0) break;
        WriteError("Quantidade inválida. Deve ser maior que zero.\n");
    }

    var movement = new StockMovement
    {
        ProductCode = code,
        Type = type,
        Description = description,
        Quantity = quantity
    };

    var result = service.Process(movement);

    Console.WriteLine();
    if (result.Succeeded)
    {
        WriteSuccess(result.Message);
        Console.WriteLine($"  ID:            {movement.Id}");
        Console.WriteLine($"  Estoque final: {result.FinalStock}");
    }
    else
    {
        WriteError(result.Message);
    }
}

// ── Interest ─────────────────────────────────────────────────────────────────

static void RunInterest(InterestService service)
{
    PrintSectionHeader("CÁLCULO DE JUROS");

    decimal amount;
    while (true)
    {
        Console.Write("  Valor original (ex: 1000,00) ou 0 para cancelar: ");
        var input = Console.ReadLine()?.Trim();
        if (input == "0") return;

        if (TryParseDecimal(input, out amount) && amount > 0) break;
        WriteError("Valor inválido. Tente novamente.\n");
    }

    DateOnly dueDate;
    while (true)
    {
        Console.Write("  Data de vencimento (dd/MM/yyyy): ");
        if (DateOnly.TryParseExact(Console.ReadLine()?.Trim(), "dd/MM/yyyy", out dueDate)) break;
        WriteError("Data inválida. Use o formato dd/MM/yyyy.\n");
    }

    var result = service.Calculate(amount, dueDate);

    Console.WriteLine();
    Console.WriteLine($"  Valor original:   {amount:C}");
    Console.WriteLine($"  Vencimento:       {dueDate:dd/MM/yyyy}");

    if (result.LateDays == 0)
    {
        WriteSuccess("Sem juros. O vencimento é hoje ou está no futuro.");
    }
    else
    {
        Console.WriteLine($"  Dias em atraso:   {result.LateDays}");
        Write($"  Juros (2,5%/dia): {result.Interest:C}\n", ConsoleColor.Yellow);
        Write($"  Total a pagar:    {result.TotalAmount:C}\n", ConsoleColor.Red);
        return;
    }

    Console.WriteLine($"  Total a pagar:    {result.TotalAmount:C}");
}

// ── Movement History ─────────────────────────────────────────────────────────

static void RunMovementHistory(InventoryService service)
{
    PrintSectionHeader("HISTÓRICO DE MOVIMENTAÇÕES");

    if (service.History.Count == 0)
    {
        Console.WriteLine("  Nenhuma movimentação registrada nesta sessão.");
        return;
    }

    Write($"  {"#",-4} {"Tipo",-8} {"Cód",-5} {"Qtd",-6} {"Descrição"}\n", ConsoleColor.DarkGray);
    Write("  " + new string('─', 60) + "\n", ConsoleColor.DarkGray);

    int i = 1;
    foreach (var m in service.History)
    {
        var typeLabel = m.Type == MovementType.Inbound ? "Entrada" : "Saída";
        var color = m.Type == MovementType.Inbound ? ConsoleColor.Green : ConsoleColor.Yellow;
        Console.Write($"  {i++,-4} ");
        Write($"{typeLabel,-8}", color);
        Console.WriteLine($" {m.ProductCode,-5} {m.Quantity,-6} {m.Description}");
    }
}

// ── Helpers ──────────────────────────────────────────────────────────────────

static void PrintSectionHeader(string title)
{
    Console.WriteLine();
    Write($"  ── {title} ──\n\n", ConsoleColor.Cyan);
}

static void WriteSuccess(string message) => Write($"  ✓ {message}\n", ConsoleColor.Green);
static void WriteError(string message) => Write($"\n  ✗ {message}\n", ConsoleColor.Red);

static void Write(string message, ConsoleColor color)
{
    Console.ForegroundColor = color;
    Console.Write(message);
    Console.ResetColor();
}

static bool TryParseDecimal(string? input, out decimal value)
{
    if (decimal.TryParse(input, NumberStyles.Any, CultureInfo.CurrentCulture, out value))
        return true;

    return decimal.TryParse(input?.Replace(',', '.'), NumberStyles.Any, CultureInfo.InvariantCulture, out value);
}
