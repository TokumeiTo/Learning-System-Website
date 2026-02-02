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
        // Because we inherit from BaseRepository, we use the protected _context or Update()
        _context.Entry(lesson).State = EntityState.Modified;
        
        // Ensure we don't accidentally overwrite the CourseId or other sensitive fields if needed
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

            // OPTIONAL: Re-gap the SortOrders so there are no holes (e.g., 1, 2, 4 becomes 1, 2, 3)
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
        var existing = await _context.LessonContents
            .Where(c => c.LessonId == lessonId)
            .ToListAsync();

        _context.LessonContents.RemoveRange(existing);

        int order = 1;
        foreach (var item in contents)
        {
            item.LessonId = lessonId;
            item.SortOrder = order++;
            await _context.LessonContents.AddAsync(item);
        }

        await SaveChangesAsync();
    }
}