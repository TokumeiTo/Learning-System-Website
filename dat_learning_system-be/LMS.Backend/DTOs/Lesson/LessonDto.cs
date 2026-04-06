using LMS.Backend.DTOs.Test_Quest;

namespace LMS.Backend.DTOs.Lesson;

public class LessonDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    // We don't include full Content here to keep the Modal fast
}
public class CreateLessonDto
{
    public Guid CourseId { get; set; }
    public string Title { get; set; } = null!;
    public string Time { get; set; } = "-:--";
    public int SortOrder { get; set; }
}
public class LessonContentDto
{
    public Guid Id { get; set; }
    public string ContentType { get; set; } = "text"; // text, image, video, test
    public string Body { get; set; } = string.Empty;
    public int SortOrder { get; set; }
    public List<TestDto> Tests { get; set; } = new();

    // If ContentType is "test", this will be populated
    public TestDto? ActiveTest => Tests.FirstOrDefault(t => t.IsActive);
}

public record ProgressRequestDto(Guid LessonId, int Seconds);

public record LessonProgressDto(
    Guid LessonId,
    int TimeSpentSeconds,
    bool IsCompleted,
    DateTime LastAccessedAt,
    string LessonTitle
);

public class ReorderLessonsDto
{
    public Guid CourseId { get; set; }
    public List<Guid> LessonIds { get; set; } = new();
}
public class SaveLessonContentsDto
{
    public Guid LessonId { get; set; }
    public List<LessonContentUploadDto> Contents { get; set; } = new();
}
public class LessonContentUploadDto
{
    public Guid? Id { get; set; }
    public string ContentType { get; set; } = string.Empty; // "text", "image", "file", etc.
    public string Body { get; set; } = string.Empty; // Will be HTML for text, or null for files
    public string? FileName { get; set; } // The name of the attached file to match
    public int SortOrder { get; set; }
    public TestDto? Test { get; set; }
}
public class UpdateLessonDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = null!;
    public string Time { get; set; } = "-:--";
    public int SortOrder { get; set; }
}
public class UpsertLessonContentDto
{
    public Guid? Id { get; set; } // Added Id to track existing blocks vs new ones
    public string ContentType { get; set; } = "text";
    public string? Body { get; set; }
    public int SortOrder { get; set; }

    // This is the key! This maps to the JSON object we built in React
    public TestDto? Test { get; set; }
}