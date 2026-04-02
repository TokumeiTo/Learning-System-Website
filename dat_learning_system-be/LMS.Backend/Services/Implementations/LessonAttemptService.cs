using AutoMapper;
using LMS.Backend.Data.Dbcontext;
using LMS.Backend.DTOs.Test_Quest;
using LMS.Backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace LMS.Backend.Services.Implement;

public class LessonAttemptService : ILessonAttemptService
{
    private readonly AppDbContext _context;
    private readonly IMapper _mapper;

    public LessonAttemptService(AppDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    // Fetches that 100% score and 9 attempts you showed me
    public async Task<List<QuizResultDto>> GetMyAttemptsByLessonAsync(string userId, Guid lessonId)
    {
        var attempts = await _context.LessonAttempts
            .Where(a => a.UserId == userId && a.LessonId == lessonId)
            .OrderByDescending(a => a.AttemptedAt)
            .ToListAsync();

        return _mapper.Map<List<QuizResultDto>>(attempts);
    }

    // 2. Matches the New Practice Center logic (By TestId instead of LessonId)
    public async Task<List<QuizResultDto>> GetMyAttemptsByTestAsync(string userId, Guid testId)
    {
        var attempts = await _context.LessonAttempts
            .Where(a => a.UserId == userId && a.TestId == testId)
            .OrderByDescending(a => a.AttemptedAt)
            .ToListAsync();
        return _mapper.Map<List<QuizResultDto>>(attempts);
    }

    // Admin View: How many people are passing like the user above?
    public async Task<AdminLessonStatsDto> GetLessonStatsForAdminAsync(Guid lessonId)
    {
        var attempts = await _context.LessonAttempts
            .Where(a => a.LessonId == lessonId)
            .ToListAsync();

        if (!attempts.Any()) return new AdminLessonStatsDto { LessonId = lessonId };

        return new AdminLessonStatsDto
        {
            LessonId = lessonId,
            TotalAttempts = attempts.Sum(a => a.Attempts), // Total clicks
            PassCount = attempts.Count(a => a.IsPassed),   // Unique students who passed
            AveragePercentage = (double)attempts.Average(a => (decimal)a.Percentage)
        };
    }

    public async Task<List<StudentPerformanceDto>> GetDepartmentKpiAsync(int orgUnitId)
    {
        return await _context.Users
            .Where(u => u.OrgUnitId == orgUnitId)
            .Select(u => new StudentPerformanceDto
            {
                UserId = u.Id,
                FullName = u.FullName,
                // Using your specific table name: UserLessonProgress
                LessonsCompleted = _context.UserLessonProgresses
                    .Count(p => p.UserId == u.Id && p.IsCompleted),
                LastActivity = _context.UserLessonProgresses
                    .Where(p => p.UserId == u.Id)
                    .Max(p => p.LastAccessedAt)
            })
            .ToListAsync();
    }
}