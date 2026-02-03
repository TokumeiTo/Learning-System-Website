using LMS.Backend.DTOs.Enrollment;

namespace LMS.Backend.Services.Interfaces;

public interface IEnrollmentService
{
    Task<IEnumerable<EnrollmentRequestDto>> GetPendingQueueAsync();
    Task<EnrollmentStatusResponseDto> GetUserEnrollmentStatusAsync(Guid courseId, string userId);
    Task<bool> RequestEnrollmentAsync(Guid courseId, string userId);
    Task<bool> RespondToRequestAsync(Guid enrollmentId, bool approve, string? reason = null);
    Task<IEnumerable<EnrollmentRequestDto>> GetHistoryAsync();
}