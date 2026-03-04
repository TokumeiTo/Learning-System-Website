using AutoMapper;
using LMS.Backend.Data.Entities;
using LMS.Backend.DTOs.Announce_Noti;
using LMS.Backend.Repo.Interface;
using LMS.Backend.Services.Interfaces;

namespace LMS.Backend.Services.Implement;

public class NotificationService(
    INotificationRepository repository, 
    IMapper mapper) : INotificationService
{
    public async Task<IEnumerable<NotificationResponseDto>> GetUserInboxAsync(string userId)
    {
        var notifications = await repository.GetByUserIdAsync(userId);
        return mapper.Map<IEnumerable<NotificationResponseDto>>(notifications);
    }

    public async Task SendSystemNotificationAsync(string userId, string title, string message, string? refId, string? refType)
    {
        var notification = new Notification
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Title = title,
            Message = message,
            ReferenceId = refId,
            ReferenceType = refType,
            CreatedAt = DateTime.UtcNow
        };

        await repository.AddAsync(notification);
    }

    public async Task MarkAsReadAsync(Guid id) => await repository.MarkAsReadAsync(id);

    public async Task ClearAllAsync(string userId) => await repository.ClearAllAsync(userId);

    public async Task RunCleanupJobAsync()
    {
        var threshold = DateTime.UtcNow.AddMonths(-1);
        await repository.HardDeleteExpiredAsync(threshold);
    }
}