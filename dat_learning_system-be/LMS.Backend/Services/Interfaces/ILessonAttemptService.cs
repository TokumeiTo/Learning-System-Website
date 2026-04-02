namespace LMS.Backend.Services.Interfaces;
using LMS.Backend.DTOs.Test_Quest;

public interface ILessonAttemptService
{
    // For the Student: See their own history
    Task<List<QuizResultDto>> GetMyAttemptsByLessonAsync(string userId, Guid lessonId);
    Task<List<QuizResultDto>> GetMyAttemptsByTestAsync(string userId, Guid testId);
    
    // For the Admin: KPI Reporting
    Task<AdminLessonStatsDto> GetLessonStatsForAdminAsync(Guid lessonId);
    Task<List<StudentPerformanceDto>> GetDepartmentKpiAsync(int orgUnitId);
}