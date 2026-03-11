namespace LMS.Backend.Data.Entities;

public class Test
{
    public Guid Id { get; set; }
    public Guid? LessonContentId { get; set; }
    public LessonContent? LessonContent { get; set; }

    public string Title { get; set; } = "Untitled Test"; // New
    public int PassingGrade { get; set; } = 70;      // New: Specific to this quiz
    public bool IsActive { get; set; } = true;

    // Meta data for JLPT Quiz Engine
    public string? JlptLevel { get; set; }
    public string? Category { get; set; }

    // For Lesson Tests
    public ICollection<Question> Questions { get; set; } = new List<Question>();
    // For Jlpt Quizzes
    public virtual ICollection<QuizItem> QuizItems { get; set; } = new List<QuizItem>();
    public virtual ICollection<QuizSession> Sessions { get; set; } = new List<QuizSession>();
}