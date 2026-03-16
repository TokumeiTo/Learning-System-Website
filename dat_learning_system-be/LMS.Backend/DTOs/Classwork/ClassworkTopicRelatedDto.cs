namespace LMS.Backend.DTOs.Classwork;

public class CreateClassworkTopicDto
{
    public string Title { get; set; } = string.Empty;
    public Guid CourseId { get; set; }
}

public class ClassworkTopicDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string CreatedBy { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }

    // Initializing with new() prevents null warnings
    public List<ClassworkItemDto> Items { get; set; } = new();
}