using Microsoft.AspNetCore.Mvc;

namespace LMS.Backend.DTOs.Course;

public class CreateCourseDto
{
    [FromForm(Name = "Title")]
    public string Title { get; set; } = string.Empty;
    public string Category { get; set; } = "Japanese";
    public string Badge { get; set; } = "Beginner";
    public double TotalHours { get; set; }
    public bool IsMandatory { get; set; }
    public string Description { get; set; } = string.Empty;
    public string Status { get; set; } = "Draft";
    public IFormFile? ThumbnailFile { get; set; }
}