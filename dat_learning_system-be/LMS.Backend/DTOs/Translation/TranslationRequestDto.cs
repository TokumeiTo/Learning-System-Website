using System.ComponentModel.DataAnnotations;

namespace LMS.Backend.DTOs.Translation;

public class TranslationRequestDto
{
    [Required]
    public string Text { get; set; } = string.Empty;
    public string SourceLanguage { get; set; } = "ja";
    public string TargetLanguage { get; set; } = "en";
    public bool IsItContext { get; set; } = false;
}