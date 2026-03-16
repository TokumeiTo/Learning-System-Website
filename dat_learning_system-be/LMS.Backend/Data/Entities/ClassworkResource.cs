using System.ComponentModel.DataAnnotations;

namespace LMS.Backend.Data.Entities;

public class ClassworkResource
{
    [Key]
    public Guid Id { get; set; }
    public Guid ClassworkItemId { get; set; }

    // The path from your Local File Service (e.g., /uploads/classwork/file.pdf) 
    // or an external URL.
    [Required]
    public string ResourceUrl { get; set; } = string.Empty;
    
    public string DisplayName { get; set; } = string.Empty; // e.g., "Reference_Guide.pdf"
    public string ResourceType { get; set; } = "File"; // "File" or "Link"

    public string UploadedBy { get; set; } = string.Empty;
    public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
}