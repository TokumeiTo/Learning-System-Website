using System.Text.Json.Serialization;

namespace LMS.Backend.Data.Models;
public class MyMemoryResponse
{
    [JsonPropertyName("responseData")]
    public MyMemoryData? ResponseData { get; set; }
}

public class MyMemoryData
{
    [JsonPropertyName("translatedText")]
    public string TranslatedText { get; set; } = string.Empty;
}