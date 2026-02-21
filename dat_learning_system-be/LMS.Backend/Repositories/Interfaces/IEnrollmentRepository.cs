using LMS.Backend.Data.Entities;

namespace LMS.Backend.Repo.Interface;

public interface IEnrollmentRepository : IBaseRepository<Enrollment>
{
    // For Admin: Get requests with User and Course details included
    Task<IEnumerable<Enrollment>> GetPendingRequestsAsync();

    // For Logic: Find a specific link between a user and a course
    Task<Enrollment?> GetUserEnrollmentAsync(Guid courseId, string userId);

    // For Security: Check if user has "Approved" access
    Task<bool> IsEnrolledAsync(Guid courseId, string userId);
    Task<IEnumerable<Enrollment>> GetEnrollmentHistoryAsync();
    Task<Enrollment?> GetWithCourseAsync(Guid id);
}