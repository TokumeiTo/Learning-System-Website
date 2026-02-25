using LMS.Backend.Data.Dbcontext;
using LMS.Backend.Data.Entities;
using LMS.Backend.Repo.Interface;
using Microsoft.EntityFrameworkCore;

namespace LMS.Backend.Repo.Implement;

public class LessonAttemptRepository : ILessonAttemptRepository
{
    private readonly AppDbContext _context;
    public LessonAttemptRepository(AppDbContext context) => _context = context;

    public async Task<LessonAttempt> CreateAttemptAsync(LessonAttempt attempt)
    {
        await _context.LessonAttempts.AddAsync(attempt);
        await _context.SaveChangesAsync();
        return attempt;
    }

    // UPDATED: Get attempts for a specific Test block (to check if they need to retry)
    public async Task<List<LessonAttempt>> GetUserAttemptsForTestAsync(string userId, Guid testId)
    {
        return await _context.LessonAttempts
            .Where(a => a.UserId == userId && a.TestId == testId)
            .OrderByDescending(a => a.AttemptedAt)
            .ToListAsync();
    }

    // UPDATED: Check if a student has passed a specific Test block
    public async Task<bool> HasUserPassedContentAsync(string userId, Guid testId)
    {
        return await _context.LessonAttempts
            .AnyAsync(a => a.UserId == userId && a.TestId == testId && a.IsPassed);
    }

    public async Task<List<LessonAttempt>> GetUserAttemptsForLessonAsync(string userId, Guid lessonId)
    {
        return await _context.LessonAttempts
            .Where(a => a.UserId == userId && a.LessonId == lessonId)
            .OrderByDescending(a => a.AttemptedAt)
            .ToListAsync();
    }

    public async Task<LessonAttempt?> GetBestAttemptForLessonAsync(string userId, Guid lessonId)
    {
        return await _context.LessonAttempts
            .Where(a => a.UserId == userId && a.LessonId == lessonId)
            .OrderByDescending(a => a.Percentage)
            .FirstOrDefaultAsync();
    }
}