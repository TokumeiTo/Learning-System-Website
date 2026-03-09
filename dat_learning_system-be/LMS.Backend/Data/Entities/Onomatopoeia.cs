namespace LMS.Backend.Data.Entities;

public class Onomatopoeia
{
    public int Id { get; set; }
    public string Phrase { get; set; } = "N/A"; // e.g., ぴかぴか
    public string Romaji { get; set; } = "N/A";// e.g., pika-pika
    public string Meaning { get; set; } = "N/A";// e.g., sparkling/shiny

    // Categorization
    public string Type { get; set; } = "N/A";// Gitaigo (State), Giseigo (Sound), etc.
    public string Category { get; set; } = "N/A";// Texture, Emotion, Movement, Weather

    public string Explanation { get; set; } = "N/A";// Cultural context or usage notes

    // Relationship for Flashcards
    public List<OnomatopoeiaExample> Examples { get; set; } = new();
}

public class OnomatopoeiaExample
{
    public int Id { get; set; }
    public string Japanese { get; set; } = "N/A";
    public string English { get; set; } = "N/A";
    public int OnomatopoeiaId { get; set; }
}