namespace LMS.Backend.Services.Interfaces;
using LMS.Backend.DTOs.Test_Quest;

public interface ILessonAttemptService
{
    // For the Student: See their own history
    Task<List<LessonResultDto>> GetMyAttemptsAsync(string userId, Guid lessonId);
    
    // For the Admin: KPI Reporting
    Task<AdminLessonStatsDto> GetLessonStatsForAdminAsync(Guid lessonId);
    Task<List<StudentPerformanceDto>> GetDepartmentKpiAsync(int orgUnitId);
    Task<List<LessonAttemptDto>> GetUserAttemptHistoryAsync(string userId, Guid lessonId);
}