namespace LMS.Backend.DTOs.Lesson;

public class UpdateLessonDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = null!;
    public string Time { get; set; } = "-:--";
}