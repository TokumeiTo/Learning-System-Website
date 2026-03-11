using LMS.Backend.DTOs.Test_Quest;

namespace LMS.Backend.Services.Interfaces;

public interface IJlptQuizService
{
    Task<List<QuizQuestionDto>> GetQuestionsForTestAsync(Guid testId);
    Task<List<JlptTestDto>> GetAvailableTestsAsync(string level, string category);
    Task<QuizResultDto> SubmitQuizAsync(QuizSubmissionDto submission);
}