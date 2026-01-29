using LMS.Backend.Common;

namespace LMS.Backend.Data.Entities;

public class Course
{
    public Guid Id { get; set; }
    
    // Changed from Enum to String to allow "Custom" creator input
    public string Category { get; set; } = "General"; 
    
    public string Title { get; set; } = string.Empty;
    public bool IsMandatory { get; set; }
    public string Thumbnail { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string CertificationImage { get; set; } = string.Empty;
    public double TotalHours { get; set; }
    public double Rating { get; set; }
    public CourseBadge Badge { get; set; }
    public int EnrolledCount { get; set; }
    
    // Soft delete logic: Use 'Closed' to hide courses without deleting them from DB
    public CourseStatus Status { get; set; } = CourseStatus.Draft;

    public List<Topic> Topics { get; set; } = new();
    public List<Lesson> Lessons { get; set; } = new();
}