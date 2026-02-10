// Data/Entities/Notification.cs
namespace LMS.Backend.Data.Entities;

public class Notification
{
    public Guid Id { get; set; }
    
    // The user who receives the notification (Student or Admin)
    public string RecipientId { get; set; } = string.Empty;
    public ApplicationUser Recipient { get; set; } = null!;

    // The user who triggered the action
    public string? SenderId { get; set; }
    public ApplicationUser? Sender { get; set; }

    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    
    // Notification types: "EnrollmentRequest", "EnrollmentAccepted", etc.
    public string Type { get; set; } = string.Empty;

    // ID of the Course or Enrollment this refers to
    public string? TargetId { get; set; }

    public bool IsRead { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}