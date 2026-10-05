using DesafioTarget.Models;
using DesafioTarget.Services;
using Microsoft.AspNetCore.Mvc;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Enable CORS for frontend
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
    });
});

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();
app.UseCors();

var dataDir = Path.Combine(AppContext.BaseDirectory, "Data");
var salesPath = Path.Combine(dataDir, "vendas.json");
var inventoryPath = Path.Combine(dataDir, "estoque.json");

var commissionService = new CommissionService();
var inventoryService = InventoryService.LoadFromJson(inventoryPath);
var interestService = new InterestService();

app.MapGet("/", () => Results.Ok(new { message = "Target Sistemas API is running.", version = "1.0" }));

app.MapGet("/api/commissions", () =>
{
    var sales = commissionService.LoadSales(salesPath);
    var result = commissionService.GetCommissionsBySalesperson(sales);
    return Results.Ok(result);
});

app.MapGet("/api/inventory", () => Results.Ok(inventoryService.Products));
app.MapGet("/api/inventory/history", () => Results.Ok(inventoryService.History));

app.MapPost("/api/inventory/movement", ([FromBody] StockMovement? movement) =>
{
    if (movement is null)
        return Results.BadRequest(MovementResult.Failure("Dados de movimentação não informados."));

    if (movement.ProductCode <= 0)
        return Results.BadRequest(MovementResult.Failure("Código do produto inválido."));

    if (string.IsNullOrWhiteSpace(movement.Description))
        return Results.BadRequest(MovementResult.Failure("A descrição da movimentação é obrigatória."));

    var result = inventoryService.Process(movement);
    if (result.Succeeded)
        return Results.Ok(result);

    return Results.BadRequest(result);
});

app.MapPost("/api/interest", ([FromBody] InterestRequest? req) =>
{
    if (req is null)
        return Results.BadRequest(new { message = "Requisição inválida." });

    if (req.Amount <= 0)
        return Results.BadRequest(new { message = "O valor deve ser maior que zero." });

    var result = interestService.Calculate(req.Amount, req.DueDate);
    return Results.Ok(result);
});

app.Run();

public record InterestRequest(decimal Amount, DateOnly DueDate);
