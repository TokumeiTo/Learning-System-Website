using LMS.Backend.Data.Entities;

namespace LMS.Backend.Repo.Interface;

public interface ITestRepository
{
    // For Admin: Save/Update a test block
    Task<Test> UpsertTestAsync(Guid lessonContentId, Test test);
    
    // For Student: Get all correct OptionIds for a lesson to grade it
    // Using a List<Guid> is memory efficient for grading
    Task<List<Guid>> GetCorrectOptionIdsForLessonAsync(Guid lessonId);
    
    // Track attempt
    Task<LessonAttempt> CreateAttemptAsync(LessonAttempt attempt);
    Task<int> GetTotalPointsForLessonAsync(Guid lessonId);
}