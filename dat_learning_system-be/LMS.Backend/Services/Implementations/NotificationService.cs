using AutoMapper;
using LMS.Backend.Data.Entities;
using LMS.Backend.DTOs.Notification;
using LMS.Backend.Repo.Interface;
using LMS.Backend.Services.Interfaces;

namespace LMS.Backend.Services.Implement;

public class NotificationService : INotificationService
{
    private readonly INotificationRepository _repo;
    private readonly IMapper _mapper;

    public NotificationService(INotificationRepository repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    public async Task CreateNotificationAsync(CreateNotificationDto dto)
    {
        // Map DTO to Entity
        var notification = _mapper.Map<Notification>(dto);

        // Persist via Repository
        await _repo.AddNotificationAsync(notification);

        // TODO: In the next step, we will add SignalR push here!
    }

    public async Task<IEnumerable<NotificationResponseDto>> GetMyNotificationsAsync(string userId)
    {
        var notifications = await _repo.GetUserNotificationsAsync(userId);
        return _mapper.Map<IEnumerable<NotificationResponseDto>>(notifications);
    }
}