using LMS.Backend.Data.Entities;

namespace LMS.Backend.Repo.Interface;

public interface INotificationRepository
{
    Task<IEnumerable<Notification>> GetUserNotificationsAsync(string userId);
    Task AddNotificationAsync(Notification notification);
    Task<Notification?> GetByIdAsync(Guid id);
    Task UpdateAsync(Notification notification);
}