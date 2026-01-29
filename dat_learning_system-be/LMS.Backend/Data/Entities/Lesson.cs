namespace LMS.Backend.Data.Entities;

public class Lesson
{
    public Guid Id { get; set; }
    public Guid CourseId { get; set; }
    public Course Course { get; set; } = null!;

    public string Title { get; set; } = "Untitled";
    public string Time { get; set; } = "-:--";
    public int SortOrder { get; set; }
    public bool IsLocked { get; set; }
    public bool IsDone { get; set; }

    public List<LessonContent> Contents { get; set; } = new();
}