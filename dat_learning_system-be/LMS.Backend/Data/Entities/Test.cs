namespace LMS.Backend.Data.Entities;
public class Test
{
    public Guid Id { get; set; }
    public Guid LessonContentId { get; set; }
    public LessonContent LessonContent { get; set; } = null!;

    public string Title { get; set; } = "Lesson Quiz"; // New
    public int PassingGrade { get; set; } = 70;      // New: Specific to this quiz

    public ICollection<Question> Questions { get; set; } = new List<Question>();
}