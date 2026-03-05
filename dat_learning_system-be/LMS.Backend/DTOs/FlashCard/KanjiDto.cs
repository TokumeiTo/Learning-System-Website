namespace LMS.Backend.DTOs.Flashcard;

public class KanjiDto
{
    public Guid Id { get; set; }
    public string Character { get; set; } = "N/A";
    public string Meaning { get; set; } = "N/A";
    public string? Romaji { get; set; }
    public int Strokes { get; set; }
    public string JlptLevel { get; set; } = "N/A";
    public List<string> Onyomi { get; set; } = new List<string>(); // We convert string to List for React
    public List<string> Kunyomi { get; set; } = new List<string>();
    public List<KanjiExampleDto> Examples { get; set; } = new List<KanjiExampleDto>();
}

public class KanjiExampleDto
{
    public Guid? Id { get; set; }
    public string Word { get; set; } = "N/A";
    public string Reading { get; set; } = "N/A";
    public string Meaning { get; set; } = "N/A";
}

public class KanjiCreateUpdateDto
{
    // No ID for Create, but we use the same DTO for Update
    public string Character { get; set; } = "N/A";
    public string Meaning { get; set; } = "N/A";
    public string? Romaji { get; set; }
    public int Strokes { get; set; }
    public string JlptLevel { get; set; } = "N/A";
    public List<string> Onyomi { get; set; } = new List<string>();
    public List<string> Kunyomi { get; set; } = new List<string>();
    public List<KanjiExampleDto> Examples { get; set; } = new List<KanjiExampleDto>();
}
