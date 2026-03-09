namespace LMS.Backend.Data.Entities;
public class QuizSession
{
    public int Id { get; set; }
    public string UserId { get; set; } = string.Empty; // Identity Link
    public int QuizTemplateId { get; set; }
    
    public DateTime StartedAt { get; set; } = DateTime.UtcNow;
    public DateTime? FinishedAt { get; set; }
    
    public int FinalScore { get; set; } // 0-100
    public bool IsPassed { get; set; }

    // Navigation
    public virtual QuizTemplate Template { get; set; } = null!;
    public virtual ICollection<QuizSessionAnswer> Answers { get; set; } = new List<QuizSessionAnswer>();
}