namespace LMS.Backend.Data.Entities;

public class Notification
{
    public Guid Id { get; set; }
    
    // Recipient Link
    public string UserId { get; set; } = null!;
    public virtual ApplicationUser User { get; set; } = null!;

    public string Title { get; set; } = null!;
    public string Message { get; set; } = null!;
    
    // Helpful for the UI to link to the specific Course/Request
    public string? ReferenceId { get; set; } 
    public string? ReferenceType { get; set; } 

    public bool IsRead { get; set; } = false;
    
    // For the "Clear All" functionality
    public bool IsDeleted { get; set; } = false;
    
    // For the "1-month expiry" background cleanup
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}