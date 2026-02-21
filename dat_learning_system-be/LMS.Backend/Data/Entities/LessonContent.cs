namespace LMS.Backend.Data.Entities;

public class LessonContent
{
    public Guid Id { get; set; }
    public Guid LessonId { get; set; }
    public Lesson Lesson { get; set; } = null!;
    
    public string ContentType { get; set; } = "text"; // text, image, video
    public string Body { get; set; } = string.Empty; // Holds text contents or URLs
    public int SortOrder { get; set; } // Order inside the lesson view
}