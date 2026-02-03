namespace LMS.Backend.DTOs.Lesson;
public class LessonDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    // We don't include full Content here to keep the Modal fast
}