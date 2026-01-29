namespace LMS.Backend.Data.Entities;

public class AuditLog
{
    public Guid Id { get; set; }
    public string EntityName { get; set; } = string.Empty; // "User", "Course", "Lesson"
    public string EntityId { get; set; } = string.Empty;   // The GUID of the record
    public string Action { get; set; } = string.Empty;     // "Created", "Updated", "Banned", "Closed"
    
    public string? PerformedBy { get; set; }                 // FK to User (Admin)
    public ApplicationUser? AdminUser { get; set; }
    
    public string? Reason { get; set; }                    // Why was this done?
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;

    // Optional: Store snapshots of the data for "Undo" functionality
    public string? OldData { get; set; }                   // JSON string
    public string? NewData { get; set; }                   // JSON string
}