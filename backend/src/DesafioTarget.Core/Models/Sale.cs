using System.Text.Json.Serialization;

namespace DesafioTarget.Models;

public class Sale
{
    [JsonPropertyName("vendedor")]
    public string Salesperson { get; set; } = string.Empty;

    [JsonPropertyName("valor")]
    public decimal Amount { get; set; }
}
