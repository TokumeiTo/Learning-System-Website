using LMS.Backend.Data.Dbcontext;
using LMS.Backend.Data.Entities;
using LMS.Backend.Repo.Interface;
using Microsoft.EntityFrameworkCore;

namespace LMS.Backend.Repo.Implement;

public class NotificationRepository : INotificationRepository
{
    private readonly AppDbContext _context;

    public NotificationRepository(AppDbContext context) => _context = context;

    public async Task<IEnumerable<Notification>> GetByUserIdAsync(string userId)
    {
        return await _context.Notifications
            .Where(n => n.UserId == userId && !n.IsDeleted)
            .OrderByDescending(n => n.CreatedAt)
            .ToListAsync();
    }

    public async Task AddAsync(Notification notification)
    {
        await _context.Notifications.AddAsync(notification);
        // We call SaveChanges here because notifications are often 'fire and forget'
        await _context.SaveChangesAsync(); 
    }

    public async Task MarkAsReadAsync(Guid notificationId)
    {
        var notification = await _context.Notifications.FindAsync(notificationId);
        
        if (notification != null)
        {
            notification.IsRead = true;
            _context.Notifications.Update(notification);
            await _context.SaveChangesAsync();
        }
    }

    public async Task ClearAllAsync(string userId)
    {
        // We only clear (soft-delete) what isn't already deleted
        var userNotifications = await _context.Notifications
            .Where(n => n.UserId == userId && !n.IsDeleted)
            .ToListAsync();

        foreach (var note in userNotifications)
        {
            note.IsDeleted = true;
        }

        await _context.SaveChangesAsync();
    }

    public async Task HardDeleteExpiredAsync(DateTime threshold)
    {
        // Efficiency check: Use ExecuteDeleteAsync if you are on EF Core 7+ 
        // to avoid loading thousands of rows into memory just to delete them.
        var expired = _context.Notifications.Where(n => n.CreatedAt < threshold);
        
        _context.Notifications.RemoveRange(expired);
        await _context.SaveChangesAsync();
    }
}