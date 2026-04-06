using LMS.Backend.Data.Dbcontext;
using LMS.Backend.Data.Entities;
using LMS.Backend.Repo.Interface;
using Microsoft.EntityFrameworkCore;

namespace LMS.Backend.Repo.Implement;

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
            // EF Core tracks 'progress', so .Update(progress) is technically optional but fine
        }

        await _context.SaveChangesAsync();
    }

    // RENAMED/MODIFIED to handle cases where progress record doesn't exist yet
    public async Task MarkAsCompleteAsync(string userId, Guid lessonId)
    {
        var progress = await GetProgressAsync(userId, lessonId);

        if (progress == null)
        {
            // If they passed the quiz before the timer-sync happened, create the record
            progress = new UserLessonProgress
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                LessonId = lessonId,
                IsCompleted = true,
                LastAccessedAt = DateTime.UtcNow
            };
            _context.UserLessonProgresses.Add(progress);
        }
        else
        {
            progress.IsCompleted = true;
            progress.LastAccessedAt = DateTime.UtcNow;
        }

        await _context.SaveChangesAsync();

        var courseId = await _context.Lessons
            .Where(l => l.Id == lessonId)
            .Select(l => l.CourseId)
            .FirstOrDefaultAsync();

        if (courseId != Guid.Empty)
        {
            // 4. Calculate New Progress
            var totalLessons = await _context.Lessons.CountAsync(l => l.CourseId == courseId);

            var completedLessons = await _context.UserLessonProgresses
                .CountAsync(p => p.UserId == userId && p.IsCompleted &&
                            _context.Lessons.Any(l => l.Id == p.LessonId && l.CourseId == courseId));

            int percentage = totalLessons > 0
                ? (int)Math.Round((double)completedLessons / totalLessons * 100)
                : 0;

            // 5. Update Enrollment
            var enrollment = await _context.Enrollments
                .FirstOrDefaultAsync(e => e.UserId == userId && e.CourseId == courseId);

            if (enrollment != null)
            {
                enrollment.ProgressPercentage = percentage;
                enrollment.IsCompleted = percentage >= 100;
            }

            await _context.SaveChangesAsync();
        }
    }

    public async Task<List<UserLessonProgress>> GetUserProgressForCourseAsync(string userId, Guid courseId)
    {
        return await _context.UserLessonProgresses
            .Include(p => p.Lesson)
            .Where(p => p.UserId == userId && p.Lesson.CourseId == courseId)
            .ToListAsync();
    }
}