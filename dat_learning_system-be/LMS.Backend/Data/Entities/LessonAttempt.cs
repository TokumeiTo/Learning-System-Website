namespace LMS.Backend.Data.Entities;

public class LessonAttempt
{
    public Guid Id { get; set; }
    public string UserId { get; set; } = string.Empty;
    // Navigation to your Identity User if needed
    // public ApplicationUser User { get; set; } = null!; 

    public Guid LessonId { get; set; }
    public Lesson Lesson { get; set; } = null!;

    public Guid TestId { get; set; }
    public Test Test { get; set; } = null!;

    public int Score { get; set; }           // Points earned (e.g., 7)
    public int MaxScore { get; set; }        // Total possible points (e.g., 10)
    // NEW: Explicit percentage for easy UI rendering (e.g., 70.0)
    public double Percentage { get; set; }   
    public bool IsPassed { get; set; }       // (Score / MaxScore) * 100 >= Lesson.PassingScore
    
    public string? AnswerJson { get; set; }
    public DateTime AttemptedAt { get; set; } = DateTime.UtcNow;
}