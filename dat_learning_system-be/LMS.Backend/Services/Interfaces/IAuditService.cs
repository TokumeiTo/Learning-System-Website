using LMS.Backend.DTOs.Audit;

namespace LMS.Backend.Services.Interfaces;

public interface IAuditService
{
    Task<PagedAuditResultDto> GetGlobalLogsAsync(
        int page,
        int pageSize,
        string? search,
        DateTime? from,
        DateTime? to
    );
}