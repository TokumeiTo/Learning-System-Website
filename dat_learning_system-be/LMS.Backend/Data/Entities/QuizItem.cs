using LMS.Backend.Common;

namespace LMS.Backend.Data.Entities;

public class QuizItem
{
    public Guid Id { get; set; }
    public Guid TestId { get; set; }
    public virtual Test Test { get; set; } = null!;

    // Links to Kanji (Guid), Grammar (Guid), or Onomato (int)
    public string SourceId { get; set; } = string.Empty; 
    
    // Tells the UI how to render the question
    public QuizDisplayMode DisplayMode { get; set; }
    
    public int SortOrder { get; set; }
    public int Points { get; set; } = 1;

    // For "Star" puzzles or custom context that isn't in the Flashcard table
    public string? CustomPrompt { get; set; } 
}