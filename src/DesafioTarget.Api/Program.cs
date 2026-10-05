using DesafioTarget.Models;
using DesafioTarget.Services;
using Microsoft.AspNetCore.Mvc;

var builder = WebApplication.CreateBuilder(args);

// Enable CORS for frontend
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
    });
});

var app = builder.Build();
app.UseCors();

var dataDir = Path.Combine(AppContext.BaseDirectory, "Data");
var salesPath = Path.Combine(dataDir, "vendas.json");
var inventoryPath = Path.Combine(dataDir, "estoque.json");

var commissionService = new CommissionService();
var inventoryService = InventoryService.LoadFromJson(inventoryPath);
var interestService = new InterestService();

app.MapGet("/", () => "Target Sistemas API is running.");

app.MapGet("/api/commissions", () =>
{
    var sales = commissionService.LoadSales(salesPath);
    return commissionService.GetCommissionsBySalesperson(sales);
});

app.MapGet("/api/inventory", () => inventoryService.Products);
app.MapGet("/api/inventory/history", () => inventoryService.History);

app.MapPost("/api/inventory/movement", ([FromBody] StockMovement movement) =>
{
    var result = inventoryService.Process(movement);
    if (result.Succeeded)
        return Results.Ok(result);
    return Results.BadRequest(result);
});

app.MapPost("/api/interest", ([FromBody] InterestRequest req) =>
{
    var result = interestService.Calculate(req.Amount, req.DueDate);
    return Results.Ok(result);
});

app.Run();

public record InterestRequest(decimal Amount, DateOnly DueDate);
