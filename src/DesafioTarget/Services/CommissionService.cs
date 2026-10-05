using DesafioTarget.Models;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace DesafioTarget.Services;

public class CommissionService
{
    private const decimal ExemptBelow = 100m;
    private const decimal HighTierFrom = 500m;
    private const decimal LowRate = 0.01m;
    private const decimal HighRate = 0.05m;

    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNameCaseInsensitive = true
    };

    public IEnumerable<SalespersonSummary> GetCommissionsBySalesperson(IEnumerable<Sale> sales)
    {
        return sales
            .GroupBy(s => s.Salesperson)
            .Select(g => new SalespersonSummary(
                Salesperson: g.Key,
                TotalSales: g.Sum(s => s.Amount),
                TotalCommission: g.Sum(s => CalculateCommission(s.Amount))
            ))
            .OrderBy(s => s.Salesperson);
    }

    public decimal CalculateCommission(decimal saleAmount)
    {
        if (saleAmount < ExemptBelow)
            return 0m;

        if (saleAmount < HighTierFrom)
            return saleAmount * LowRate;

        return saleAmount * HighRate;
    }

    public IEnumerable<Sale> LoadSales(string jsonPath)
    {
        var json = File.ReadAllText(jsonPath);
        var data = JsonSerializer.Deserialize<SalesJson>(json, JsonOptions);
        return data?.Sales ?? [];
    }

    private record SalesJson([property: JsonPropertyName("vendas")] List<Sale> Sales);
}

public record SalespersonSummary(string Salesperson, decimal TotalSales, decimal TotalCommission);
