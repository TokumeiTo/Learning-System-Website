using LMS.Backend.Data.Dbcontext;
using LMS.Backend.Data.Entities;
using LMS.Backend.Repo.Interface;
using Microsoft.EntityFrameworkCore;

namespace LMS.Backend.Repo.Implement;

public class CourseRepository : BaseRepository<Course>, ICourseRepository
{
    public CourseRepository(AppDbContext context) : base(context) { }

    public async Task<IEnumerable<Course>> GetAllWithTopicsAsync()
    {
        return await _context.Courses
            .Include(c => c.ClassworkTopics) // Fetch the topics so .Count works
            .Include(c => c.Lessons)
            .AsNoTracking()
            .ToListAsync();
    }
    public async Task<Course?> GetFullClassroomDetailsAsync(Guid courseId)
    {
        return await _context.Courses
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