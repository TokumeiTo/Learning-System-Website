using LMS.Backend.Data.Dbcontext;
using LMS.Backend.Data.Entities;
using LMS.Backend.Repo.Interface;
using Microsoft.EntityFrameworkCore;

namespace LMS.Backend.Repo.Implement;

public class CourseRatingRepository : BaseRepository<CourseRating>, ICourseRatingRepository
{
    public CourseRatingRepository(AppDbContext context) : base(context) { }

    public async Task<CourseRating?> GetUserRatingAsync(Guid courseId, string userId)
    {
        return await _context.CourseRatings
            .FirstOrDefaultAsync(r => r.CourseId == courseId && r.UserId == userId);
    }

    public async Task<(double Average, int Count)> GetCourseRatingStatsAsync(Guid courseId)
    {
        var ratings = await _context.CourseRatings
            .Where(r => r.CourseId == courseId)
            .Select(r => r.Score)
            .ToListAsync();

        if (!ratings.Any()) return (0, 0);

        return (ratings.Average(), ratings.Count);
    }
}