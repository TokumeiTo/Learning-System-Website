using LMS.Backend.Common;
using LMS.Backend.Data.Entities;

namespace LMS.Backend.Repo.Interface;

public interface IAnnouncementRepository
{
    Task<Announcement?> GetByIdAsync(Guid id);
    Task<IEnumerable<Announcement>> GetForUserAsync(Position userPosition);
    Task<IEnumerable<Announcement>> GetAllForAdminAsync();
    Task UpsertAsync(Announcement announcement); // The Manual Sync logic
    Task DeleteAsync(Guid id);
}