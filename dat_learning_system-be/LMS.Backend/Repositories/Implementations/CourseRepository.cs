using LMS.Backend.Data.Dbcontext;
using LMS.Backend.Data.Entities;
using LMS.Backend.Repo.Interface;
using Microsoft.EntityFrameworkCore;

namespace LMS.Backend.Repo.Implement;

public class CourseRepository : BaseRepository<Course>, ICourseRepository
{
    public CourseRepository(AppDbContext context) : base(context) { }

    public async Task<Course?> GetFullClassroomDetailsAsync(Guid courseId)
    {
        return await _context.Courses
            .Include(c => c.Lessons)
                .ThenInclude(l => l.Contents) // The "Free Will" blocks
            .Include(c => c.Topics)
                .ThenInclude(t => t.Assignments) // The "Google Classroom" part
            .FirstOrDefaultAsync(c => c.Id == courseId);
    }
    public async Task UpdateRatingCacheAsync(Guid courseId, double newAverage, int newCount)
    {
        var course = await _dbSet.FindAsync(courseId);
        if (course != null)
        {
            course.Rating = newAverage;
            course.ReviewCount = newCount;
            // No need to call _dbSet.Update(course) because FindAsync 
            // attaches it to the tracker automatically. 
            // It will be saved when SaveChangesAsync is called in the service.
        }
    }
}