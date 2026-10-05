using DesafioTarget.Models;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace DesafioTarget.Services;

public class InventoryService
{
    private readonly List<Product> _products;
    private readonly List<StockMovement> _history = [];
    private readonly HashSet<Guid> _usedIds = [];

    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNameCaseInsensitive = true
    };

    public InventoryService(List<Product> products)
    {
        _products = products;
    }

    public static InventoryService LoadFromJson(string jsonPath)
    {
        var json = File.ReadAllText(jsonPath);
        var data = JsonSerializer.Deserialize<InventoryJson>(json, JsonOptions);
        return new InventoryService(data?.Products ?? []);
    }

    public IReadOnlyList<Product> Products => _products.AsReadOnly();
    public IReadOnlyList<StockMovement> History => _history.AsReadOnly();

    public MovementResult Process(StockMovement movement)
    {
        if (_usedIds.Contains(movement.Id))
            return MovementResult.Failure("Identificador da movimentação já utilizado.");

        if (movement.Quantity <= 0)
            return MovementResult.Failure("A quantidade deve ser maior que zero.");

        var product = _products.FirstOrDefault(p => p.Code == movement.ProductCode);
        if (product is null)
            return MovementResult.Failure($"Produto com código {movement.ProductCode} não encontrado.");

        if (movement.Type == MovementType.Outbound && product.Stock < movement.Quantity)
            return MovementResult.Failure("Não é possível realizar a saída. O estoque disponível é insuficiente.");

        ApplyMovement(product, movement);
        _usedIds.Add(movement.Id);
        _history.Add(movement);

        return MovementResult.Success(product.Stock);
    }

    private static void ApplyMovement(Product product, StockMovement movement)
    {
        product.Stock = movement.Type == MovementType.Inbound
            ? product.Stock + movement.Quantity
            : product.Stock - movement.Quantity;
    }

    private record InventoryJson([property: JsonPropertyName("estoque")] List<Product> Products);
}

public record MovementResult(bool Succeeded, string Message, int FinalStock)
{
    public static MovementResult Success(int finalStock) =>
        new(true, "Movimentação realizada com sucesso.", finalStock);

    public static MovementResult Failure(string message) =>
        new(false, message, 0);
}
