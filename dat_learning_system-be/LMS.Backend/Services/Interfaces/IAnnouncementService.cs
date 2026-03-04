

using LMS.Backend.Common;
using LMS.Backend.DTOs.Announce_Noti;

namespace LMS.Backend.Services.Interfaces;

public interface IAnnouncementService
{
    Task<IEnumerable<AnnouncementResponseDto>> GetForUserAsync(Position position);
    Task<IEnumerable<AnnouncementResponseDto>> GetAllForAdminAsync();
    Task UpsertAsync(UpsertAnnouncementDto dto, string adminId);
    Task DeleteAsync(Guid id);
}