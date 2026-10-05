using DesafioTarget.Models;
using DesafioTarget.Services;
using Xunit;

namespace DesafioTarget.Tests;

public class CommissionServiceTests
{
    private readonly CommissionService _service = new();

    [Theory]
    [InlineData(0, 0)]
    [InlineData(50, 0)]
    [InlineData(99.99, 0)]
    public void CalculateCommission_BelowExemptThreshold_ReturnsZero(decimal amount, decimal expected)
    {
        Assert.Equal(expected, _service.CalculateCommission(amount));
    }

    [Theory]
    [InlineData(100, 1)]
    [InlineData(250, 2.50)]
    [InlineData(499.99, 4.9999)]
    public void CalculateCommission_LowTier_ReturnsOnePercent(decimal amount, decimal expected)
    {
        Assert.Equal(expected, _service.CalculateCommission(amount));
    }

    [Theory]
    [InlineData(500, 25)]
    [InlineData(1000, 50)]
    [InlineData(1200.50, 60.025)]
    public void CalculateCommission_HighTier_ReturnsFivePercent(decimal amount, decimal expected)
    {
        Assert.Equal(expected, _service.CalculateCommission(amount));
    }

    [Fact]
    public void GetCommissionsBySalesperson_GroupsAndSumsCorrectly()
    {
        var sales = new List<Sale>
        {
            new() { Salesperson = "Alice", Amount = 1000m },
            new() { Salesperson = "Alice", Amount = 200m },
            new() { Salesperson = "Bob", Amount = 500m }
        };

        var results = _service.GetCommissionsBySalesperson(sales).ToList();

        Assert.Equal(2, results.Count);

        var alice = results.First(r => r.Salesperson == "Alice");
        Assert.Equal(1200m, alice.TotalSales);
        Assert.Equal(52m, alice.TotalCommission); // 1000*5% + 200*1% = 50+2
    }
}
