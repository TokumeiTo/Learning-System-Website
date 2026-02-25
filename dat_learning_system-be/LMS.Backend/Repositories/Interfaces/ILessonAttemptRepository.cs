using LMS.Backend.Data.Entities;

namespace LMS.Backend.Repo.Interface;

public interface ILessonAttemptRepository
{
    Task<LessonAttempt> CreateAttemptAsync(LessonAttempt attempt);
    Task<List<LessonAttempt>> GetUserAttemptsForLessonAsync(string userId, Guid lessonId);
    Task<LessonAttempt?> GetBestAttemptForLessonAsync(string userId, Guid lessonId);
}