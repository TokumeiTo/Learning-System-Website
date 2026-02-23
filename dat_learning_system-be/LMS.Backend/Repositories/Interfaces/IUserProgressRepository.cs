using LMS.Backend.Data.Entities;

namespace LMS.Backend.Data.Repositories.Interfaces;

public interface IUserProgressRepository
{
    Task<UserLessonProgress?> GetProgressAsync(string userId, Guid lessonId);
    Task UpsertProgressAsync(string userId, Guid lessonId, int secondsToAdd);
    Task MarkAsCompleteAsync(string userId, Guid lessonId);
    Task<List<UserLessonProgress>> GetUserProgressForCourseAsync(string userId, Guid courseId);
}