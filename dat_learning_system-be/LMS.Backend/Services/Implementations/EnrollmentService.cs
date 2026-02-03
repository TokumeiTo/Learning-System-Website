using AutoMapper;
using LMS.Backend.Data.Entities;
using LMS.Backend.DTOs.Enrollment;
using LMS.Backend.Repo.Interface;
using LMS.Backend.Services.Interfaces;

namespace LMS.Backend.Services.Implement;

public class EnrollmentService : IEnrollmentService
{
    private readonly IEnrollmentRepository _repo;
    private readonly IMapper _mapper;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public EnrollmentService(
        IEnrollmentRepository repo,
        IMapper mapper,
        IHttpContextAccessor httpContextAccessor
    )
    {
        _repo = repo;
        _mapper = mapper;
        _httpContextAccessor = httpContextAccessor;
    }

    // For Admin: Fetch all pending requests for the dashboard
    public async Task<IEnumerable<EnrollmentRequestDto>> GetPendingQueueAsync()
    {
        var requests = await _repo.GetPendingRequestsAsync();
        return _mapper.Map<IEnumerable<EnrollmentRequestDto>>(requests);
    }

    // For Course Modal: Check the current status for the logged-in user
    public async Task<EnrollmentStatusResponseDto> GetUserEnrollmentStatusAsync(Guid courseId, string userId)
    {
        var enrollment = await _repo.GetUserEnrollmentAsync(courseId, userId);

        if (enrollment == null)
        {
            return new EnrollmentStatusResponseDto { IsEnrolled = false, Status = "None" };
        }

        return new EnrollmentStatusResponseDto
        {
            IsEnrolled = enrollment.Status == "Approved",
            Status = enrollment.Status
        };
    }

    // For Student: Submit a new enrollment request
    public async Task<bool> RequestEnrollmentAsync(Guid courseId, string userId)
    {
        var existing = await _repo.GetUserEnrollmentAsync(courseId, userId);

        // Prevent duplicate requests if one already exists (Pending/Approved/Rejected)
        if (existing != null) return false;

        var enrollment = new Enrollment
        {
            Id = Guid.NewGuid(),
            CourseId = courseId,
            UserId = userId,
            Status = "Pending",
            RequestedAt = DateTime.UtcNow
        };

        await _repo.AddAsync(enrollment);
        return await _repo.SaveChangesAsync();
    }

    // For Admin: Approve or Reject a specific enrollment
    public async Task<bool> RespondToRequestAsync(Guid enrollmentId, bool approve, string? reason = null)
    {
        var enrollment = await _repo.GetByIdAsync(enrollmentId);
        if (enrollment == null) return false;

        // REMOVED: if (enrollment.Status != "Pending") return false; 
        // This allows transitioning between Approved <-> Rejected

        if (_httpContextAccessor.HttpContext != null)
        {
            _httpContextAccessor.HttpContext.Items["AuditReason"] = reason ?? "None";
        }

        enrollment.Status = approve ? "Approved" : "Rejected";

        // Manage timestamps: Only set date if moving to Approved. 
        // If moving from Approved -> Rejected, we nullify it.
        enrollment.ApprovedAt = approve ? DateTime.UtcNow : null;

        _repo.Update(enrollment);
        return await _repo.SaveChangesAsync();
    }

    public async Task<IEnumerable<EnrollmentRequestDto>> GetHistoryAsync()
    {
        // Fetch all records where Status is 'Approved' or 'Rejected'
        var history = await _repo.GetEnrollmentHistoryAsync();

        // Map to your DTO (AutoMapper handles the conversion to StudentName, CourseTitle, etc.)
        return _mapper.Map<IEnumerable<EnrollmentRequestDto>>(history);
    }
}