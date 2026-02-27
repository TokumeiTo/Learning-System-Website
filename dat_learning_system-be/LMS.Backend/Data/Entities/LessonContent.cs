namespace LMS.Backend.Data.Entities;

public class LessonContent
{
    public Guid Id { get; set; }
    public Guid LessonId { get; set; }
    public Lesson Lesson { get; set; } = null!;
    
    public string ContentType { get; set; } = "text"; // text, image, video, test
    public string Body { get; set; } = string.Empty; // text contents or URLs (empty if test)
    public int SortOrder { get; set; }

    // Navigation for Test logic
    // If ContentType == "test", this relationship will be used
    public ICollection<Test> Tests { get; set; } = new List<Test>(); 
}