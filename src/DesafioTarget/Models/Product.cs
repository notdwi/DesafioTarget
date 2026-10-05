using System.Text.Json.Serialization;

namespace DesafioTarget.Models;

public class Product
{
    [JsonPropertyName("codigoProduto")]
    public int Code { get; set; }

    [JsonPropertyName("descricaoProduto")]
    public string Description { get; set; } = string.Empty;

    [JsonPropertyName("estoque")]
    public int Stock { get; set; }
}
