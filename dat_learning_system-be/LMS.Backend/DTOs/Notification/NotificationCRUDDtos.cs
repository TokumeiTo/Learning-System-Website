namespace LMS.Backend.DTOs.Notification;

public class CreateNotificationDto
{
    public string RecipientId { get; set; } = string.Empty;
    public string? SenderId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string? TargetId { get; set; }
}