namespace LMS.Backend.DTOs.Lesson;
public class ReorderLessonsDto
{
    public Guid CourseId { get; set; }
    public List<Guid> LessonIds { get; set; } = new();
}