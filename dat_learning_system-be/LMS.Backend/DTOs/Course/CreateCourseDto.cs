namespace LMS.Backend.DTOs.Course;

public class CreateCourseDto
{
    public string Title { get; set; } = string.Empty;
    public string Category { get; set; } = "Japanese";
    public string Badge { get; set; } = "Beginner";
    public double TotalHours { get; set; }
    public bool IsMandatory { get; set; }
    public string Description { get; set; } = string.Empty;
    public string Status { get; set; } = "Draft";
    public string? ThumbnailFile { get; set; }
}