using LMS.Backend.Common;
using LMS.Backend.Data.Dbcontext;
using LMS.Backend.Data.Entities;
using LMS.Backend.Repo.Interface;
using Microsoft.EntityFrameworkCore;

namespace LMS.Backend.Repo.Implement;

public class AnnouncementRepository : IAnnouncementRepository
{
    private readonly AppDbContext _context;

    public AnnouncementRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Announcement?> GetByIdAsync(Guid id)
    {
        // Including CreatedByUser in case the Admin UI needs to show who wrote it
        return await _context.Announcements
            .Include(a => a.CreatedByUser)
            .FirstOrDefaultAsync(a => a.Id == id);
    }

    public async Task<IEnumerable<Announcement>> GetForUserAsync(Position userPosition)
    {
        var positionString = userPosition.ToString();

        return await _context.Announcements
            .Where(a => (string.IsNullOrEmpty(a.TargetPosition) ||
                         a.TargetPosition.Contains(positionString))
                        && a.DisplayUntil > DateTime.UtcNow)
            .OrderByDescending(a => a.CreatedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<Announcement>> GetAllForAdminAsync()
    {
        // For Admins: Show everything (past and future) so they can edit/delete old ones
        return await _context.Announcements
            .Include(a => a.CreatedByUser)
            .OrderByDescending(a => a.CreatedAt)
            .ToListAsync();
    }

    public async Task UpsertAsync(Announcement announcement)
    {
        // Manual Sync logic: Check if exists -> Update; if not -> Add
        var existing = await _context.Announcements.FindAsync(announcement.Id);

        if (existing == null)
        {
            // Ensure ID is generated if not provided, though Guid.NewGuid() is usually handled in the DTO/Service
            if (announcement.Id == Guid.Empty) announcement.Id = Guid.NewGuid();

            await _context.Announcements.AddAsync(announcement);
        }
        else
        {
            // Manually mapping to prevent blind overwrites of metadata
            existing.Title = announcement.Title;
            existing.Content = announcement.Content;
            existing.TargetPosition = announcement.TargetPosition;
            existing.DisplayUntil = announcement.DisplayUntil;

            // We do NOT update CreatedAt or CreatedByUserId here to maintain audit integrity
            _context.Announcements.Update(existing);
        }

        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Guid id)
    {
        var announcement = await _context.Announcements.FindAsync(id);
        if (announcement != null)
        {
            _context.Announcements.Remove(announcement);
            await _context.SaveChangesAsync();
        }
    }
}