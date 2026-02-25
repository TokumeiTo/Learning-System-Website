using LMS.Backend.Repo.Interface;
using LMS.Backend.Services.Interfaces;
using LMS.Backend.DTOs.Test_Quest;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using LMS.Backend.Data.Dbcontext;

namespace LMS.Backend.Services.Implement;

public class LessonAttemptService(
    ILessonAttemptRepository attemptRepo,
    IUserProgressRepository progressRepo, // Added for accurate completion KPI
    IMapper mapper,
    AppDbContext context) : ILessonAttemptService
{
    // --- Student Logic ---
    public async Task<List<LessonResultDto>> GetMyAttemptsAsync(string userId, Guid lessonId)
    {
        // USE progressRepo: Verify user has actually accessed this lesson before showing results
        var progress = await progressRepo.GetProgressAsync(userId, lessonId);
        if (progress == null) return new List<LessonResultDto>();

        var attempts = await attemptRepo.GetUserAttemptsForLessonAsync(userId, lessonId);
        return mapper.Map<List<LessonResultDto>>(attempts);
    }

    // --- Admin KPI Logic ---

    public async Task<AdminLessonStatsDto> GetLessonStatsForAdminAsync(Guid lessonId)
    {
        // Efficiency: Use the repository where possible
        var attempts = await attemptRepo.GetUserAttemptsForLessonAsync(null!, lessonId); // If repo supports null userId for "All"

        // If repo doesn't support "All", we keep this here but optimized
        var stats = await context.LessonAttempts
            .Where(a => a.LessonId == lessonId)
            .GroupBy(a => a.LessonId)
            .Select(g => new AdminLessonStatsDto
            {
                LessonId = lessonId,
                TotalAttempts = g.Count(),
                PassCount = g.Count(a => a.IsPassed),
                AveragePercentage = (double)g.Average(a => a.Percentage)
            })
            .FirstOrDefaultAsync();

        if (stats == null) return new AdminLessonStatsDto { LessonId = lessonId };

        var lesson = await context.Lessons.FindAsync(lessonId);
        stats.LessonTitle = lesson?.Title ?? "Deleted Lesson";

        return stats;
    }

   public async Task<List<StudentPerformanceDto>> GetDepartmentKpiAsync(int orgUnitId)
    {
        // We use 'context' here for the complex Join/Group KPI query to keep it as 1 SQL hit
        return await context.Users
            .Where(u => u.OrgUnitId == orgUnitId)
            .Select(u => new StudentPerformanceDto
            {
                UserId = u.Id,
                FullName = u.FullName,
                Email = u.Email ?? "N/A",
                // Accurate KPI from the Progress table
                LessonsCompleted = context.UserLessonProgresses
                    .Count(p => p.UserId == u.Id && p.IsCompleted),
                
                OverallAverageScore = (double)(context.LessonAttempts
                    .Where(a => a.UserId == u.Id)
                    .Average(a => (decimal?)a.Percentage) ?? 0),
                
                LastActivity = context.LessonAttempts
                    .Where(a => a.UserId == u.Id)
                    .Max(a => (DateTime?)a.AttemptedAt)
            })
            .ToListAsync();
    }

    public async Task<List<LessonAttemptDto>> GetUserAttemptHistoryAsync(string userId, Guid lessonId)
    {
        // Use repo! Don't use _context here.
        var attempts = await attemptRepo.GetUserAttemptsForLessonAsync(userId, lessonId);
        return mapper.Map<List<LessonAttemptDto>>(attempts);
    }
}