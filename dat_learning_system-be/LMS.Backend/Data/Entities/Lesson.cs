namespace LMS.Backend.Data.Entities;

public class Lesson
{
    public Guid Id { get; set; }
    public Guid CourseId { get; set; }
    public Course Course { get; set; } = null!;

    public string Title { get; set; } = "Untitled";
    public string Time { get; set; } = "-:--";
    public int SortOrder { get; set; }

    public List<LessonContent> Contents { get; set; } = new();
    
    // To track how many times this student tried this lesson
    public ICollection<LessonAttempt> Attempts { get; set; } = new List<LessonAttempt>();
}