using System.ComponentModel.DataAnnotations;

namespace LMS.Backend.Data.Entities;

public class ClassworkTopic
{
    [Key]
    public Guid Id { get; set; }
    public Guid CourseId { get; set; }
    
    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    public string CreatedBy { get; set; } = string.Empty; // Admin UserId
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation: Deleting this deletes all Items (and their Submissions/Resources)
    public List<ClassworkItem> Items { get; set; } = new();
}