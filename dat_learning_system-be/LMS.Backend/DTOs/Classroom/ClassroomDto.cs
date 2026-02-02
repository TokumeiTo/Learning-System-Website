namespace LMS.Backend.DTOs.Classroom;

public class ClassroomContentDto
{
    public Guid Id { get; set; }
    public string ContentType { get; set; } = null!;
    public string Body { get; set; } = null!;
    public int SortOrder { get; set; }
}

public class ClassroomLessonDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = null!;
    public string Time { get; set; } = "-:--";
    public int SortOrder { get; set; }
    public bool IsLocked { get; set; }
    public bool IsDone { get; set; }
    public List<ClassroomContentDto> Contents { get; set; } = new();
}

public class ClassroomViewDto
{
    public Guid CourseId { get; set; }
    public string CourseTitle { get; set; } = null!;
    public List<ClassroomLessonDto> Lessons { get; set; } = new();
}