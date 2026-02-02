namespace LMS.Backend.DTOs.Lesson;

public class SaveLessonContentsDto
{
    public Guid LessonId { get; set; }
    public List<UpsertLessonContentDto> Contents { get; set; } = [];
}