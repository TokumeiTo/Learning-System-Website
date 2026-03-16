namespace LMS.Backend.DTOs.Classwork;

public class CreateClassworkItemDto
{
    public Guid TopicId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; } 
    public string ItemType { get; set; } = "Resource"; 
    public DateTime? DueDate { get; set; }
    public double MaxPoints { get; set; }
    public List<CreateClassworkResourceDto> Resources { get; set; } = new();
}

public class ClassworkItemDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string ItemType { get; set; } = string.Empty;
    public DateTime? DueDate { get; set; }
    public double MaxPoints { get; set; }
    
    // --- New Fields for UI ---
    public string CreatedBy { get; set; } = string.Empty; // The Admin ID
    public string CreatedByName { get; set; } = string.Empty; // The Admin Name (e.g. "John Doe")
    public DateTime CreatedAt { get; set; }
    // ------------------------

    public List<ClassworkResourceDto> Resources { get; set; } = new();
    public ClassworkSubmissionDto? MySubmission { get; set; }
}