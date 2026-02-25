using AutoMapper;
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
        // 1. Basic validation (preventing weird data)
        if (dto.Seconds <= 0 || dto.Seconds > 60) return false;

        // 2. Fetch current progress to check status
        var currentProgress = await _repo.GetProgressAsync(userId, dto.LessonId);

        // 3. STOP counting if the lesson is already completed
        if (currentProgress != null && currentProgress.IsCompleted)
        {
            // We return true because the request was "processed," 
            // but we skip the database write to save resources.
            return true;
        }

        // 4. If not completed, proceed with tracking
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