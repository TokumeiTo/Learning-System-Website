namespace LMS.Backend.DTOs.Lesson;

public class UpsertLessonContentDto
{
    public string ContentType { get; set; } = "text";
    public string Body { get; set; } = string.Empty;
}