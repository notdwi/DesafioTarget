using DesafioTarget.Models;
using DesafioTarget.Services;
using Xunit;

namespace DesafioTarget.Tests;

public class InventoryServiceTests
{
    private static InventoryService CreateService() => new([
        new Product { Code = 101, Description = "Pen", Stock = 50 },
        new Product { Code = 102, Description = "Eraser", Stock = 10 }
    ]);

    [Fact]
    public void Process_Inbound_IncreasesStock()
    {
        var service = CreateService();
        var movement = new StockMovement { ProductCode = 101, Type = MovementType.Inbound, Description = "Purchase", Quantity = 20 };

        var result = service.Process(movement);

        Assert.True(result.Succeeded);
        Assert.Equal(70, result.FinalStock);
    }

    [Fact]
    public void Process_Outbound_DecreasesStock()
    {
        var service = CreateService();
        var movement = new StockMovement { ProductCode = 101, Type = MovementType.Outbound, Description = "Sale", Quantity = 10 };

        var result = service.Process(movement);

        Assert.True(result.Succeeded);
        Assert.Equal(40, result.FinalStock);
    }

    [Fact]
    public void Process_OutboundExceedsStock_IsRejected()
    {
        var service = CreateService();
        var movement = new StockMovement { ProductCode = 102, Type = MovementType.Outbound, Description = "Sale", Quantity = 100 };

        var result = service.Process(movement);

        Assert.False(result.Succeeded);
        Assert.Contains("insuficiente", result.Message, StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public void Process_UnknownProduct_IsRejected()
    {
        var service = CreateService();
        var movement = new StockMovement { ProductCode = 999, Type = MovementType.Inbound, Description = "Test", Quantity = 5 };

        var result = service.Process(movement);

        Assert.False(result.Succeeded);
        Assert.Contains("não encontrado", result.Message, StringComparison.OrdinalIgnoreCase);
    }

    [Theory]
    [InlineData(0)]
    [InlineData(-5)]
    public void Process_InvalidQuantity_IsRejected(int quantity)
    {
        var service = CreateService();
        var movement = new StockMovement { ProductCode = 101, Type = MovementType.Inbound, Description = "Test", Quantity = quantity };

        var result = service.Process(movement);

        Assert.False(result.Succeeded);
    }

    [Fact]
    public void StockMovement_IdsAreUnique()
    {
        var first = new StockMovement();
        var second = new StockMovement();

        Assert.NotEqual(first.Id, second.Id);
    }
}
