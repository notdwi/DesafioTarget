namespace DesafioTarget.Models;

public class StockMovement
{
    public Guid Id { get; } = Guid.NewGuid();
    public int ProductCode { get; set; }
    public MovementType Type { get; set; }
    public string Description { get; set; } = string.Empty;
    public int Quantity { get; set; }
}
