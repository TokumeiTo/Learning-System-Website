using LMS.Backend.Common;
using LMS.Backend.Data.Dbcontext;
using LMS.Backend.Data.Entities;
using LMS.Backend.Repo.Interface;
using Microsoft.EntityFrameworkCore;

namespace LMS.Backend.Repo.Implement;

public class CourseRepository : BaseRepository<Course>, ICourseRepository
{
    public CourseRepository(AppDbContext context) : base(context) { }

    public async Task<IEnumerable<Course>> GetAllWithTopicsAsync(bool showDrafts = false)
    {
        var query = _context.Courses
            .Include(c => c.ClassworkTopics)
            .Include(c => c.Lessons)
            .AsNoTracking();

        if (showDrafts)
        {
            query = query.IgnoreQueryFilters();
        }
        else
        {
            query = query.Where(c => c.Status == CourseStatus.Published);
        }

        return await query.ToListAsync();
    }
    public async Task<Course?> GetByIdWithIgnoreFilterAsync(Guid id)
    {
        return await _context.Courses
            .IgnoreQueryFilters()
            .FirstOrDefaultAsync(c => c.Id == id);
    }
    public async Task<Course?> GetFullClassroomDetailsAsync(Guid courseId)
    {
        return await _context.Courses
            .IgnoreQueryFilters()
            .Include(c => c.Lessons)
                .ThenInclude(l => l.Contents) // The "Curriculum" part
            .Include(c => c.ClassworkTopics)  // Updated from .Topics
                .ThenInclude(t => t.Items)     // Updated from .Assignments
                    .ThenInclude(i => i.Resources)
            .Include(c => c.ClassworkTopics)
                .ThenInclude(t => t.Items)
                    .ThenInclude(i => i.Submissions)
            .AsNoTracking() // Recommended for "Get" details to improve performance
            .FirstOrDefaultAsync(c => c.Id == courseId);
    }

    public async Task UpdateRatingCacheAsync(Guid courseId, double newAverage, int newCount)
    {
        var course = await _dbSet.FindAsync(courseId);
        if (course != null)
        {
            course.Rating = newAverage;
            course.ReviewCount = newCount;
            // No need for SaveChangesAsync here as it should be handled 
            // by the Service/Unit of Work pattern.
        }
    }
}