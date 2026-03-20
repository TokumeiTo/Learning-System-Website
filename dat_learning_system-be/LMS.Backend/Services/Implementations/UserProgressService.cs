using AutoMapper;
using LMS.Backend.DTOs.Lesson;
using LMS.Backend.Repo.Interface;
using LMS.Backend.Services.Interfaces;

namespace LMS.Backend.Services.Implement;

public class UserProgressService : IUserProgressService
{
    private readonly IUserProgressRepository _repo;
    private readonly ILibraryRepository _userBookrepo;
    private readonly IMapper _mapper;

    public UserProgressService(IUserProgressRepository repo, IMapper mapper, ILibraryRepository userBookrepo)
    {
        _repo = repo;
        _mapper = mapper;
        _userBookrepo = userBookrepo;
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

    public async Task<bool> UpdateBookHeartbeatAsync(Guid userId, int bookId, int seconds)
    {
        // 1. Validation (matches your lesson logic)
        if (seconds <= 0 || seconds > 60) return false;

        // 2. Convert seconds to minutes for our "Lean" DB storage
        double minutesToAdd = (double)seconds / 60;

        // 3. Upsert the activity (Repository should handle the "HasOpened" flag here too)
        await _userBookrepo.UpdateActivityAsync(userId, bookId, minutesToAdd);

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