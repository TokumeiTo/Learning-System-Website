using LMS.Backend.DTOs.Test_Quest;

namespace LMS.Backend.Services.Interfaces;

public interface ITestService
{
    // Admin: Saves or Updates a test within a LessonContent block
    Task<bool> SaveTestAsync(Guid? contentId, TestDto dto);

    // Student: Grades the entire lesson based on multiple choice selections
    Task<QuizResultDto> GradQuizAsync(string userId, QuizSubmissionDto submission);
    Task<List<QuizResultDto>> GetMyAttemptsByLevelAsync(string userId, string level);
}