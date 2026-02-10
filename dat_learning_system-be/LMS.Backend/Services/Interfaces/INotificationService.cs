using LMS.Backend.DTOs.Notification;

namespace LMS.Backend.Services.Interfaces;

public interface INotificationService
{
    Task CreateNotificationAsync(CreateNotificationDto dto);
    Task<IEnumerable<NotificationResponseDto>> GetMyNotificationsAsync(string userId);
}