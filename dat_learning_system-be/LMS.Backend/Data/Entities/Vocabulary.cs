namespace LMS.Backend.Data;

public class Vocabulary
{
    public Guid Id { get; set; }
    public string Word { get; set; } = string.Empty;
    public string Reading { get; set; } = string.Empty;
    public string Meaning { get; set; } = string.Empty;
    public string PartOfSpeech { get; set; } = string.Empty; // e.g., Noun, Verb
    public string JLPTLevel { get; set; } = "N5";
    public string? Explanation { get; set; }
    
    // One-to-Many Relationship
    public List<VocabularyExample> Examples { get; set; } = new();
}

public class VocabularyExample
{
    public Guid Id { get; set; }
    public string Japanese { get; set; } = string.Empty;
    public string English { get; set; } = string.Empty;
    
    public Guid VocabularyId { get; set; }
}