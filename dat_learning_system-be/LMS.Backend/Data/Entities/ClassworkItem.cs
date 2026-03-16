using System.ComponentModel.DataAnnotations;

namespace LMS.Backend.Data.Entities;

public class ClassworkItem
{
    [Key]
    public Guid Id { get; set; }
    public Guid TopicId { get; set; }

    [Required]
    [MaxLength(55)]
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }

    // Logic: "Assignment" requires submission, "Resource" is view-only
    public string ItemType { get; set; } = "Resource"; 
    
    public DateTime? DueDate { get; set; }
    public double MaxPoints { get; set; }
    
    public string CreatedBy { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public List<ClassworkResource> Resources { get; set; } = new();
    public List<ClassworkSubmission> Submissions { get; set; } = new();
}