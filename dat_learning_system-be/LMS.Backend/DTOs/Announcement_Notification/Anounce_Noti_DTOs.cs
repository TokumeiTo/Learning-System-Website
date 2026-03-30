namespace LMS.Backend.DTOs.Announce_Noti;

// Announcements
public record AnnouncementResponseDto
{
    public Guid Id { get; init; }
    public string Title { get; init; } = null!;
    public string Content { get; init; } = null!;
    public string? TargetPosition { get; init; }
    public DateTime CreatedAt { get; init; }
    public DateTime DisplayUntil { get; init; }
    public string AuthorName { get; init; } = "Unknown Author";
}

public record UpsertAnnouncementDto(
    Guid? Id, 
    string Title, 
    string Content, 
    List<string>? TargetPositions, 
    DateTime DisplayUntil
);

// Notifications
public record NotificationResponseDto(
    Guid Id, 
    string Title, 
    string Message, 
    string? ReferenceId, 
    string? ReferenceType, 
    bool IsRead, 
    DateTime CreatedAt
);