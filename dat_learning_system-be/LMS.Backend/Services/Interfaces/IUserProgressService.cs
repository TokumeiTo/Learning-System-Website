using LMS.Backend.DTOs.Lesson;

namespace LMS.Backend.Services.Interfaces;

public interface IUserProgressService
{
    Task<bool> UpdateHeartbeatAsync(string userId, ProgressRequestDto dto);
    Task<LessonProgressDto?> GetLessonProgressAsync(string userId, Guid lessonId);
    Task MarkAsCompleteAsync(string userId, Guid lessonId);
}