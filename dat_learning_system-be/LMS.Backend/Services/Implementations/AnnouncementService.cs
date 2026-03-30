using AutoMapper;
using LMS.Backend.Common;
using LMS.Backend.Data.Entities;
using LMS.Backend.DTOs.Announce_Noti;
using LMS.Backend.Hubs;
using LMS.Backend.Repo.Interface;
using LMS.Backend.Services.Interfaces;
using Microsoft.AspNetCore.SignalR;

namespace LMS.Backend.Services.Implement;

public class AnnouncementService(
    IAnnouncementRepository repository,
    IMapper mapper,
    IHubContext<NotificationHub> hubContext) : IAnnouncementService
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
       Announcement? announcement = null;

        if (dto.Id.HasValue && dto.Id != Guid.Empty)
        {
            announcement = await repository.GetByIdAsync(dto.Id.Value);

        }

        if (announcement == null)
        {
            announcement = mapper.Map<Announcement>(dto);
            announcement.CreatedAt = DateTime.UtcNow;
            announcement.CreatedByUserId = adminId;

            if (announcement.Id == Guid.Empty) announcement.Id = Guid.NewGuid();
        }
        else 
        {
            mapper.Map(dto, announcement);
        }

        announcement.DisplayUntil = DateTime.SpecifyKind(announcement.DisplayUntil, DateTimeKind.Utc);

        await repository.UpsertAsync(announcement);

        // --- REAL-TIME SIGNAL LOGIC ---
        // If it's a new announcement or a targeted update, notify the relevant users
        if (string.IsNullOrEmpty(announcement.TargetPosition))
        {
            // Global announcement: Notify everyone
            await hubContext.Clients.All.SendAsync("ReceiveAnnouncement", "New Global Announcement Available");
        }
        else
        {
            // Targeted: Notify only the specific position group
            var groups = announcement.TargetPosition.Split(',', StringSplitOptions.RemoveEmptyEntries);
            foreach (var group in groups)
            await hubContext.Clients.Group(group.Trim()).SendAsync("ReceiveAnnouncement", $"New Announcement for {group}");
        }
    }

    public async Task DeleteAsync(Guid id) => await repository.DeleteAsync(id);
}