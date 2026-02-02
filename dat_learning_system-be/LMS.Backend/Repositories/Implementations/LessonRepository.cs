using LMS.Backend.Data.Dbcontext;
using LMS.Backend.Data.Entities;
using LMS.Backend.Repo.Interface;
using Microsoft.EntityFrameworkCore;

namespace LMS.Backend.Repo.Implement;

public class LessonRepository(AppDbContext context) : ILessonRepository
{
    public async Task<Course?> GetClassroomStructureAsync(Guid courseId)
    {
        return await context.Courses
            .Include(c => c.Lessons.OrderBy(l => l.SortOrder))
                .ThenInclude(l => l.Contents.OrderBy(lc => lc.SortOrder))
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.Id == courseId);
    }
}