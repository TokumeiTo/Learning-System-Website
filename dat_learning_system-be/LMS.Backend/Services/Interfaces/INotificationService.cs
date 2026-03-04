using LMS.Backend.DTOs.Announce_Noti;

namespace LMS.Backend.Services.Interfaces;

public interface INotificationService
{
    Task<IEnumerable<NotificationResponseDto>> GetUserInboxAsync(string userId);
    Task SendSystemNotificationAsync(string userId, string title, string message, string? refId = null, string? refType = null);
    Task MarkAsReadAsync(Guid id);
    Task ClearAllAsync(string userId);
    Task RunCleanupJobAsync(); // For the 30-day rule
}