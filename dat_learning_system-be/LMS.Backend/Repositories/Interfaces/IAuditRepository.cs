using LMS.Backend.Data.Entities;

namespace LMS.Backend.Repo.Interface;

public interface IAuditRepository : IBaseRepository<AuditLog>
{
    Task<IEnumerable<AuditLog>> GetLogsByEntityAsync(string entityName, string entityId);
}