using System.ComponentModel.DataAnnotations;

namespace LMS.Backend.Data.Entities;

public class ClassworkSubmission
{
    [Key]
    public Guid Id { get; set; }
    public Guid ClassworkItemId { get; set; }
    
    [Required]
    public string UserId { get; set; } = string.Empty;

    // File path from Local File Service
    [Required]
    public string FileUrl { get; set; } = string.Empty;
    public string FileName { get; set; } = string.Empty;

    public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;
    
    // If this is not null, the UI shows "Edited on [Date]"
    public DateTime? UpdatedAt { get; set; }

    // Grading fields
    public double? Grade { get; set; }
    public string? Feedback { get; set; }
}