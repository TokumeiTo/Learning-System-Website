using LMS.Backend.Data.Entities;

namespace LMS.Backend.Repo.Interface;

public interface ICourseRepository : IBaseRepository<Course>
{
    Task<Course?> GetFullClassroomDetailsAsync(Guid courseId);
    Task<IEnumerable<Course>> GetAllWithTopicsAsync();
    Task UpdateRatingCacheAsync(Guid courseId, double newAverage, int newCount);
}