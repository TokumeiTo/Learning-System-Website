using LMS.Backend.Data.Entities;

namespace LMS.Backend.Repo.Interface;

public interface ITestRepository
{
    // For Admin: Save/Update a test block
    Task<Test> UpsertTestAsync(Guid lessonContentId, Test test);

    // For Student: Get all correct OptionIds for a lesson to grade it
    // Using a List<Guid> is memory efficient for grading
    Task<List<Guid>> GetCorrectOptionIdsForLessonAsync(Guid lessonId);
    Task<IEnumerable<Test>> GetGlobalQuizzesAsync(string? level, string? category);
    Task<object> GetCategoryProgressAsync(string userId, string level);

    // Track attempt
    Task<LessonAttempt> UpsertAttemptAsync(LessonAttempt newAttempt);
    Task<int> GetTotalPointsForLessonAsync(Guid lessonId);
    Task<Test?> GetTestByIdWithAnswersAsync(Guid testId);
    Task<List<LessonAttempt>> GetAttemptsByLevelAsync(string userId, string level);
}