using LMS.Backend.Data.Dbcontext;
using LMS.Backend.Data.Entities;
using LMS.Backend.Repo.Interface;
using Microsoft.EntityFrameworkCore;

namespace LMS.Backend.Repo.Implement;

public class LessonRepository : BaseRepository<Lesson>, ILessonRepository
{
    public LessonRepository(AppDbContext context) : base(context) { }

    public async Task<Lesson> CreateLessonAsync(Lesson lesson)
    {
        await AddAsync(lesson);
        await SaveChangesAsync();
        return lesson;
    }

    // NEW: Specialized Update for Lesson Metadata
    public async Task UpdateLessonAsync(Lesson lesson)
    {
        var existing = await _context.Lessons.FindAsync(lesson.Id);
        if (existing == null) return;

        // Update only the fields that are allowed to change
        existing.Title = lesson.Title;
        existing.Time = lesson.Time;
        // We usually don't want to change CourseId here via a simple update

        await SaveChangesAsync();
    }

    // NEW: Delete Lesson and potentially re-adjust sort orders of remaining lessons
    public async Task DeleteLessonAsync(Guid lessonId)
    {
        var lesson = await GetByIdAsync(lessonId);
        if (lesson != null)
        {
            Delete(lesson);
            await SaveChangesAsync();

            // Re-gap the SortOrders so there are no holes (e.g., 1, 2, 4 becomes 1, 2, 3)
            var remainingLessons = await _context.Lessons
                .Where(l => l.CourseId == lesson.CourseId)
                .OrderBy(l => l.SortOrder)
                .ToListAsync();

            for (int i = 0; i < remainingLessons.Count; i++)
            {
                remainingLessons[i].SortOrder = i + 1;
            }

            await SaveChangesAsync();
        }
    }

    public async Task<Course?> GetClassroomStructureAsync(Guid courseId)
    {
        return await _context.Courses
            .Include(c => c.Lessons.OrderBy(l => l.SortOrder))
                .ThenInclude(l => l.Contents.OrderBy(lc => lc.SortOrder))
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.Id == courseId);
    }

    public async Task<int> GetNextSortOrderAsync(Guid courseId)
    {
        var lastOrder = await _context.Lessons
            .Where(l => l.CourseId == courseId)
            .MaxAsync(l => (int?)l.SortOrder) ?? 0;
        return lastOrder + 1;
    }

    public async Task ReOrderLessonsAsync(Guid courseId, List<Guid> lessonIds)
    {
        var lessons = await _context.Lessons
                .Where(l => l.CourseId == courseId)
                .ToListAsync();

        for (int i = 0; i < lessonIds.Count; i++)
        {
            var lesson = lessons.FirstOrDefault(l => l.Id == lessonIds[i]);
            if (lesson != null) lesson.SortOrder = i + 1;
        }
        await SaveChangesAsync();
    }

    public async Task SaveLessonContentsAsync(Guid lessonId, IEnumerable<LessonContent> contents)
    {
        // 1. Get the strategy
        var strategy = _context.Database.CreateExecutionStrategy();

        // 2. Wrap everything in the strategy execution
        await strategy.ExecuteAsync(async () =>
        {
            // 3. Start the transaction INSIDE the strategy
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                // Remove existing
                var existing = await _context.LessonContents
                    .Where(c => c.LessonId == lessonId)
                    .ToListAsync();

                _context.LessonContents.RemoveRange(existing);
                await SaveChangesAsync();

                // Add new
                int order = 1;
                foreach (var item in contents)
                {
                    item.Id = Guid.NewGuid();
                    item.LessonId = lessonId;
                    item.SortOrder = order++;
                    await _context.LessonContents.AddAsync(item);
                }

                await SaveChangesAsync();
                await transaction.CommitAsync();
            }
            catch
            {
                await transaction.RollbackAsync();
                throw; // Re-throw so the strategy knows it might need to retry
            }
        });
    }
}