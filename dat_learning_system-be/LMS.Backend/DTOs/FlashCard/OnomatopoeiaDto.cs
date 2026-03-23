namespace LMS.Backend.DTOs.Flashcard;

public class OnomatoResponseDto
{
    public int Id { get; set; }
    public string Phrase { get; set; } = "N/A";    // e.g. どきどき
    public string Romaji { get; set; } = "N/A";  // e.g. doki-doki
    public string Meaning { get; set; } = "N/A";  // e.g. heart pounding
    public string Type { get; set; } = "N/A"; // Gitaigo, Giseigo, etc.
    public string Category { get; set; } = "N/A"; // Emotion, Weather, etc.
    public string? Explanation { get; set; }

    public List<OnomatoExampleDto> Examples { get; set; } = new();
}

public class OnomatoExampleDto
{
    public int? Id { get; set; } // Optional for new examples
    public string Japanese { get; set; } = "N/A";
    public string English { get; set; } = "N/A";
}

public class OnomatoUpsertRequestDto
{
    public int? Id { get; set; }
    public string Phrase { get; set; } = "N/A";
    public string Romaji { get; set; } = "N/A";
    public string Meaning { get; set; } = "N/A";
    public string Type { get; set; } = "N/A";
    public string Category { get; set; } = "N/A";
    public string? Explanation { get; set; }

    // We send the full list every time to support "Manual Sync" logic
    public List<OnomatoExampleDto> Examples { get; set; } = new();
}