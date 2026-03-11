namespace LMS.Backend.Data.Entities;
public class QuizSessionAnswer
{
    public int Id { get; set; }
    public int QuizSessionId { get; set; }
    public Guid QuizItemId { get; set; } // Points to the QuizItem
    
    public string UserAnswer { get; set; } = string.Empty;
    public bool IsCorrect { get; set; }

    public virtual QuizSession Session { get; set; } = null!;
    public virtual QuizItem QuizItem { get; set; } = null!;
}