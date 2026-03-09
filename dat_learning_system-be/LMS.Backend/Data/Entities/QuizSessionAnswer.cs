namespace LMS.Backend.Data.Entities;
public class QuizSessionAnswer
{
    public int Id { get; set; }
    public int QuizSessionId { get; set; }
    
    // The ID of the record in the Onomatopoeia/Kanji/Grammar table
    public int SourceId { get; set; } 
    
    public string UserAnswer { get; set; } = string.Empty;
    public bool IsCorrect { get; set; }

    public virtual QuizSession Session { get; set; } = null!;
}