using AutoMapper;
using LMS.Backend.Common;
using LMS.Backend.Data.Entities;
using LMS.Backend.DTOs.Announce_Noti;
using LMS.Backend.Repo.Interface;
using LMS.Backend.Services.Interfaces;

namespace LMS.Backend.Services.Implement;

public class AnnouncementService(
    IAnnouncementRepository repository, 
    IMapper mapper) : IAnnouncementService
{
    public async Task<IEnumerable<AnnouncementResponseDto>> GetForUserAsync(Position position)
    {
        var entities = await repository.GetForUserAsync(position);
        return mapper.Map<IEnumerable<AnnouncementResponseDto>>(entities);
    }

    public async Task<IEnumerable<AnnouncementResponseDto>> GetAllForAdminAsync()
    {
        var entities = await repository.GetAllForAdminAsync();
        return mapper.Map<IEnumerable<AnnouncementResponseDto>>(entities);
    }

    public async Task UpsertAsync(UpsertAnnouncementDto dto, string adminId)
    {
        // Use our manual Sync logic by mapping DTO -> Entity first
        var announcement = mapper.Map<Announcement>(dto);
        
        // Ensure the metadata is correct for a new entry
        if (dto.Id == null || dto.Id == Guid.Empty)
        {
            announcement.CreatedAt = DateTime.UtcNow;
            announcement.CreatedByUserId = adminId;
        }

        await repository.UpsertAsync(announcement);
    }

    public async Task DeleteAsync(Guid id) => await repository.DeleteAsync(id);
}