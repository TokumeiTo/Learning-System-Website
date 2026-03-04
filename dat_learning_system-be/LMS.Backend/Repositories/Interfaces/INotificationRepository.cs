using LMS.Backend.Data.Entities;

namespace LMS.Backend.Repo.Interface;

public interface INotificationRepository
{
    Task<IEnumerable<Notification>> GetByUserIdAsync(string userId);
    Task AddAsync(Notification notification);
    Task MarkAsReadAsync(Guid notificationId);
    Task ClearAllAsync(string userId); // Soft delete
    Task HardDeleteExpiredAsync(DateTime threshold); // Cleanup job logic
}