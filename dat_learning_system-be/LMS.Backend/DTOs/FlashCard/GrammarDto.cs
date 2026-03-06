namespace LMS.Backend.DTOs.Flashcard;

public class GrammarDto
{
    public Guid? Id { get; set; } // Nullable for creation
    public string Title { get; set; } = null!;
    public string JlptLevel { get; set; } = null!;
    public string Meaning { get; set; } = null!;
    public string Structure { get; set; } = null!;
    public string Explanation { get; set; } = null!;
    public List<GrammarExampleDto> Examples { get; set; } = new();
}

// DTOs/GrammarExampleDto.cs
public class GrammarExampleDto
{
    public Guid? Id { get; set; } = null!;
    public string Jp { get; set; } = null!;
    public string Romaji { get; set; } = null!;
    public string En { get; set; } = null!;
}


public class GrammarCreateUpdateDto
{
    public string Title { get; set; } = null!;
    public string JlptLevel { get; set; } = null!;
    public string Meaning { get; set; } = null!;
    public string Structure { get; set; } = null!;
    public string Explanation { get; set; } = null!;
    public List<GrammarExampleDto> Examples { get; set; } = new();
}