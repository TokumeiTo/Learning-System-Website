namespace LMS.Backend.DTOs.Announce_Noti;

// Announcements
public record AnnouncementResponseDto(
    Guid Id, 
    string Title, 
    string Content, 
    string? TargetPosition, // String for the FE
    DateTime CreatedAt, 
    DateTime DisplayUntil,
    string AuthorName
);

public record UpsertAnnouncementDto(
    Guid? Id, 
    string Title, 
    string Content, 
    string? TargetPosition, 
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