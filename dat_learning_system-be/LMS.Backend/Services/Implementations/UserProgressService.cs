using AutoMapper;
using LMS.Backend.Data.Repositories.Interfaces;
using LMS.Backend.DTOs.Lesson;
using LMS.Backend.Repo.Interface;
using LMS.Backend.Services.Interfaces;

namespace LMS.Backend.Services.Implement;

public class UserProgressService : IUserProgressService
{
    private readonly IUserProgressRepository _repo;
    private readonly IMapper _mapper;

    public UserProgressService(IUserProgressRepository repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    public async Task<bool> UpdateHeartbeatAsync(string userId, ProgressRequestDto dto)
    {
        // Suspect heartbeat check (10-60 seconds is normal)
        if (dto.Seconds <= 0 || dto.Seconds > 60) return false;

        await _repo.UpsertProgressAsync(userId, dto.LessonId, dto.Seconds);
        return true;
    }

    public async Task<LessonProgressDto?> GetLessonProgressAsync(string userId, Guid lessonId)
    {
        var progress = await _repo.GetProgressAsync(userId, lessonId);
        return _mapper.Map<LessonProgressDto>(progress);
    }
    public async Task MarkAsCompleteAsync(string userId, Guid lessonId)
    {
        // Simply pass the call to your repository
        await _repo.MarkAsCompleteAsync(userId, lessonId);
    }
}