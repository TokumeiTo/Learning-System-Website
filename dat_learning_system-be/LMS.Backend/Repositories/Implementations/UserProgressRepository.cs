using LMS.Backend.Data.Dbcontext;
using LMS.Backend.Data.Entities;
using LMS.Backend.Data.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace LMS.Backend.Data.Repositories;

public class UserProgressRepository : IUserProgressRepository
{
    private readonly AppDbContext _context;

    public UserProgressRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<UserLessonProgress?> GetProgressAsync(string userId, Guid lessonId)
    {
        return await _context.UserLessonProgresses
            .FirstOrDefaultAsync(p => p.UserId == userId && p.LessonId == lessonId);
    }

    public async Task UpsertProgressAsync(string userId, Guid lessonId, int secondsToAdd)
    {
        var progress = await GetProgressAsync(userId, lessonId);

        if (progress == null)
        {
            _context.UserLessonProgresses.Add(new UserLessonProgress
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                LessonId = lessonId,
                TimeSpentSeconds = secondsToAdd,
                LastAccessedAt = DateTime.UtcNow,
                IsCompleted = false
            });
        }
        else
        {
            progress.TimeSpentSeconds += secondsToAdd;
            progress.LastAccessedAt = DateTime.UtcNow;
            _context.UserLessonProgresses.Update(progress);
        }

        await _context.SaveChangesAsync();
    }

    public async Task MarkAsCompleteAsync(string userId, Guid lessonId)
    {
        var progress = await GetProgressAsync(userId, lessonId);
        if (progress != null)
        {
            progress.IsCompleted = true;
            progress.LastAccessedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
        }
    }

    public async Task<List<UserLessonProgress>> GetUserProgressForCourseAsync(string userId, Guid courseId)
    {
        return await _context.UserLessonProgresses
            .Include(p => p.Lesson) // Join with Lesson table
            .Where(p => p.UserId == userId && p.Lesson.CourseId == courseId)
            .ToListAsync();
    }
}