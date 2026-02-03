using LMS.Backend.Data.Dbcontext;
using LMS.Backend.Data.Entities;
using LMS.Backend.Repo.Interface;
using Microsoft.EntityFrameworkCore;

namespace LMS.Backend.Repo.Implement;

public class EnrollmentRepository : BaseRepository<Enrollment>, IEnrollmentRepository
{
    public EnrollmentRepository(AppDbContext context) : base(context) { }

    public async Task<IEnumerable<Enrollment>> GetPendingRequestsAsync()
    {
        // Include related data so the Admin DTO can show Name and Course Title
        return await _dbSet
            .Include(e => e.User)
            .Include(e => e.Course)
            .Where(e => e.Status == "Pending")
            .OrderByDescending(e => e.RequestedAt)
            .AsNoTracking() // Recommended for read-only listing
            .ToListAsync();
    }

    public async Task<Enrollment?> GetUserEnrollmentAsync(Guid courseId, string userId)
    {
        // Used by the Service to determine the current state (None, Pending, Approved)
        return await _dbSet
            .AsNoTracking()
            .FirstOrDefaultAsync(e => e.CourseId == courseId && e.UserId == userId);
    }

    public async Task<bool> IsEnrolledAsync(Guid courseId, string userId)
    {
        // Quick check specifically for classroom access security
        return await _dbSet
            .AnyAsync(e => e.CourseId == courseId &&
                           e.UserId == userId &&
                           e.Status == "Approved");
    }
    public async Task<IEnumerable<Enrollment>> GetEnrollmentHistoryAsync()
    {
        return await _dbSet
            .Include(e => e.User)
            .Include(e => e.Course)
            .Where(e => e.Status != "Pending") // Get everything that is already processed
            .OrderByDescending(e => e.ApprovedAt) // Show most recent approvals first
            .AsNoTracking()
            .ToListAsync();
    }
}