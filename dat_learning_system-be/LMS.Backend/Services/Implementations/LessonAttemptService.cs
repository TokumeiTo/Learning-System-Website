using LMS.Backend.Repo.Interface;
using LMS.Backend.Services.Interfaces;
using LMS.Backend.DTOs.Test_Quest;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using LMS.Backend.Data.Dbcontext;

namespace LMS.Backend.Services.Implement;

public class LessonAttemptService(
    ILessonAttemptRepository attemptRepo,
    IUserProgressRepository progressRepo,
    ILessonRepository lessonRepo,
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
        // 1. Fetch Lesson details first
        var lesson = await lessonRepo.GetByIdAsync(lessonId);
        if (lesson == null)
            return new AdminLessonStatsDto { LessonId = lessonId, LessonTitle = "Not Found" };

        // 2. Consolidate Stats Query
        // We fetch the basic aggregates in one shot from the Attempts table
        var statsQuery = await context.LessonAttempts
            .Where(a => a.LessonId == lessonId)
            .GroupBy(a => a.LessonId)
            .Select(g => new
            {
                Total = g.Count(),
                Passed = g.Count(a => a.IsPassed),
                Avg = g.Average(a => a.Percentage)
            })
            .FirstOrDefaultAsync();

        // 3. Populate Difficult Questions (The "Too Hard" Logic)
        // This looks into the stored answers to see which QuestionIds appear most in failed attempts
        var difficultQuestions = await GetDifficultQuestionsAsync(lessonId);

        return new AdminLessonStatsDto
        {
            LessonId = lessonId,
            LessonTitle = lesson.Title,
            TotalAttempts = statsQuery?.Total ?? 0,
            PassCount = statsQuery?.Passed ?? 0,
            AveragePercentage = (double)(statsQuery?.Avg ?? 0),
            DifficultQuestions = difficultQuestions
        };
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

    private async Task<List<QuestionAnalyticDto>> GetDifficultQuestionsAsync(Guid lessonId)
    {
        // 1. Get all questions for this lesson
        var questions = await context.Questions
            .Where(q => q.Test.LessonContent.LessonId == lessonId)
            .Select(q => new
            {
                q.Id,
                q.QuestionText,
                CorrectOptionId = q.Options.Where(o => o.IsCorrect).Select(o => o.Id).FirstOrDefault()
            })
            .ToListAsync();

        // 2. Get all attempts for this lesson
        var attempts = await context.LessonAttempts
            .Where(a => a.LessonId == lessonId)
            .Select(a => a.AnswerJson)
            .ToListAsync();

        if (!attempts.Any()) return new List<QuestionAnalyticDto>();

        var analytics = new List<QuestionAnalyticDto>();

        // 3. Calculate Failure Rate per question
        foreach (var q in questions)
        {
            int missedCount = 0;

            foreach (var json in attempts)
            {
                if (string.IsNullOrEmpty(json)) continue;

                // Deserialize the Dictionary<QuestionId, OptionId>
                var answers = System.Text.Json.JsonSerializer.Deserialize<Dictionary<Guid, Guid>>(json);

                // If question was answered AND the answer is NOT the correct option ID
                if (answers != null && answers.TryGetValue(q.Id, out Guid selectedId))
                {
                    if (selectedId != q.CorrectOptionId) missedCount++;
                }
                else
                {
                    // If they didn't answer it at all, count it as missed
                    missedCount++;
                }
            }

            analytics.Add(new QuestionAnalyticDto
            {
                QuestionId = q.Id,
                QuestionText = q.QuestionText,
                FailureRate = Math.Round((double)missedCount / attempts.Count * 100, 2)
            });
        }

        return analytics.OrderByDescending(x => x.FailureRate).Take(5).ToList();
    }
}