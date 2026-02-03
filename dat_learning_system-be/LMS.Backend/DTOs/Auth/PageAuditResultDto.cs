namespace LMS.Backend.DTOs.Audit;

public class PagedAuditResultDto
{
    public IEnumerable<GlobalAuditLogDto> Data { get; set; } = new List<GlobalAuditLogDto>();
    public int TotalCount { get; set; }
}