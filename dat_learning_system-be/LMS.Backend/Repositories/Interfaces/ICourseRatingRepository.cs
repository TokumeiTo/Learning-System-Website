using LMS.Backend.Data.Entities;

namespace LMS.Backend.Repo.Interface;

public interface ICourseRatingRepository : IBaseRepository<CourseRating>
{
    Task<CourseRating?> GetUserRatingAsync(Guid courseId, string userId);
    Task<(double Average, int Count)> GetCourseRatingStatsAsync(Guid courseId);
}