using DesafioTarget.Services;
using Xunit;

namespace DesafioTarget.Tests;

public class InterestServiceTests
{
    private readonly InterestService _service = new();

    [Fact]
    public void Calculate_FutureDueDate_ReturnsNoInterest()
    {
        var dueDate = DateOnly.FromDateTime(DateTime.Today.AddDays(5));

        var result = _service.Calculate(1000m, dueDate);

        Assert.Equal(0m, result.Interest);
        Assert.Equal(1000m, result.TotalAmount);
        Assert.Equal(0, result.LateDays);
    }

    [Fact]
    public void Calculate_DueDateIsToday_ReturnsNoInterest()
    {
        var dueDate = DateOnly.FromDateTime(DateTime.Today);

        var result = _service.Calculate(1000m, dueDate);

        Assert.Equal(0m, result.Interest);
        Assert.Equal(1000m, result.TotalAmount);
        Assert.Equal(0, result.LateDays);
    }

    [Fact]
    public void Calculate_OneDayLate_ReturnsCorrectInterest()
    {
        var dueDate = DateOnly.FromDateTime(DateTime.Today.AddDays(-1));

        var result = _service.Calculate(1000m, dueDate);

        Assert.Equal(1, result.LateDays);
        Assert.Equal(25m, result.Interest);   // 1000 * 0.025 * 1
        Assert.Equal(1025m, result.TotalAmount);
    }

    [Fact]
    public void Calculate_FourDaysLate_ReturnsCorrectInterest()
    {
        var dueDate = DateOnly.FromDateTime(DateTime.Today.AddDays(-4));

        var result = _service.Calculate(1000m, dueDate);

        Assert.Equal(4, result.LateDays);
        Assert.Equal(100m, result.Interest);  // 1000 * 0.025 * 4
        Assert.Equal(1100m, result.TotalAmount);
    }

    [Fact]
    public void Calculate_UsesSimpleInterest()
    {
        var dueDate = DateOnly.FromDateTime(DateTime.Today.AddDays(-10));

        var result = _service.Calculate(500m, dueDate);

        Assert.Equal(125m, result.Interest);  // 500 * 0.025 * 10
    }
}
