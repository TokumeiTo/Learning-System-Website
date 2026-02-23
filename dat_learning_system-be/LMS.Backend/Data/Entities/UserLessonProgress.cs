namespace LMS.Backend.Data.Entities;

public class UserLessonProgress
{
    public Guid Id { get; set; }
    public string UserId { get; set; } = null!;
    public Guid LessonId { get; set; }
    public int TimeSpentSeconds { get; set; }
    public bool IsCompleted { get; set; }
    public DateTime LastAccessedAt { get; set; }

    // Navigation properties
    public virtual ApplicationUser User { get; set; } = null!;
    public virtual Lesson Lesson { get; set; } = null!;
}