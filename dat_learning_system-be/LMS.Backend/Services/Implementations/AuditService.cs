using AutoMapper;
using LMS.Backend.DTOs.Audit;
using LMS.Backend.Repo.Interface;
using LMS.Backend.Services.Interfaces;

namespace LMS.Backend.Services.Implement;

public class AuditService : IAuditService
{
    private readonly IAuditRepository _repo;
    private readonly IMapper _mapper;

    public AuditService(IAuditRepository repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    public async Task<PagedAuditResultDto> GetGlobalLogsAsync(
        int page, 
        int pageSize, 
        string? search, 
        DateTime? from, 
        DateTime? to)
    {
        // Call the repository which returns (IEnumerable<AuditLog> Logs, int TotalCount)
        var (logs, totalCount) = await _repo.GetPagedLogsAsync(page, pageSize, search, from, to);

        // Map the entities to DTOs
        var dtos = _mapper.Map<IEnumerable<GlobalAuditLogDto>>(logs);

        // Return the combined result
        return new PagedAuditResultDto
        {
            Data = dtos,
            TotalCount = totalCount
        };
    }
}