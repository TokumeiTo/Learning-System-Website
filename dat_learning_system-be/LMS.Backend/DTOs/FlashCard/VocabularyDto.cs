namespace LMS.Backend.DTOs.Flashcard;

public class VocabExampleDto
{
    public string Japanese { get; set; } = string.Empty;
    public string English { get; set; } = string.Empty;
}

public class VocabResponseDto
{
    public Guid Id { get; set; }
    public string Word { get; set; } = string.Empty;
    public string Reading { get; set; } = string.Empty;
    public string Meaning { get; set; } = string.Empty;
    public string PartOfSpeech { get; set; } = string.Empty;
    public string JLPTLevel { get; set; } = "N5";
    public string? Explanation { get; set; }
    public List<VocabExampleDto> Examples { get; set; } = new();
}

public class VocabUpsertRequestDto
{
    public Guid? Id { get; set; } // Null = Create, HasValue = Update
    public string Word { get; set; } = string.Empty;
    public string Reading { get; set; } = string.Empty;
    public string Meaning { get; set; } = string.Empty;
    public string PartOfSpeech { get; set; } = string.Empty;
    public string JLPTLevel { get; set; } = "N5";
    public string? Explanation { get; set; }
    public List<VocabExampleDto> Examples { get; set; } = new();
}