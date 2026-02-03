using LMS.Backend.Data.Entities;

namespace LMS.Backend.Repo.Interface;

public interface IAuditRepository
{
    // Returns a Tuple containing the list of logs and the total count for pagination
    Task<(IEnumerable<AuditLog> Logs, int TotalCount)> GetPagedLogsAsync(
        int page, 
        int pageSize, 
        string? search, 
        DateTime? from, 
        DateTime? to);

    Task<IEnumerable<AuditLog>> GetLogsByEntityAsync(string entityName);
}