namespace LMS.Backend.DTOs.Classroom;

public class CreateLessonDto
{
    public Guid CourseId { get; set; }
    public string Title { get; set; } = null!;
    public string Time { get; set; } = "-:--";
    public int SortOrder { get; set; }
}