using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace LMS.Backend.DTOs.Course;

public class UpdateCourseDto
{
    [Required]
    [StringLength(200, MinimumLength = 3)]
    public string Title { get; set; } = string.Empty;

    public string? Description { get; set; }

    // Using string so we can parse it into the CourseStatus Enum in the Service
    public string? Status { get; set; }

    public string? Badge { get; set; }

    // Optional: If null, the Service keeps the existing Thumbnail path
    public IFormFile? ThumbnailFile { get; set; }
}

public class CourseSummaryDto
{
    public Guid Id { get; set; }
    public string Category { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Thumbnail { get; set; } = string.Empty;
    public string? Badge { get; set; }
    public string Status { get; set; } = string.Empty;
}