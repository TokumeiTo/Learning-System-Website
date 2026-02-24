namespace LMS.Backend.Data.Entities;
public class Test
{
    public Guid Id { get; set; }
    
    // Links to the LessonContent block of type "test"
    public Guid LessonContentId { get; set; }
    public LessonContent LessonContent { get; set; } = null!;

    public ICollection<Question> Questions { get; set; } = new List<Question>();
}