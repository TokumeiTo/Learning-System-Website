using LMS.Backend.Data.Dbcontext;
using LMS.Backend.Data.Entities;
using LMS.Backend.Repo.Interface;
using Microsoft.EntityFrameworkCore;

namespace LMS.Backend.Repo.Implement;

public class AuditRepository : IAuditRepository
{
    private readonly AppDbContext _context;

    public AuditRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<(IEnumerable<AuditLog> Logs, int TotalCount)> GetPagedLogsAsync(
        int page, 
        int pageSize, 
        string? search, 
        DateTime? from, 
        DateTime? to)
    {
        // 1. Include AdminUser to get the FullName from the Users table
        var query = _context.AuditLogs
            .Include(l => l.AdminUser) 
            .AsQueryable();

        // 2. Date Filtering
        if (from.HasValue)
            query = query.Where(l => l.Timestamp >= from.Value);
        
        if (to.HasValue)
            query = query.Where(l => l.Timestamp <= to.Value);

        // 3. Search Logic (Now searching by Admin Name too!)
        if (!string.IsNullOrWhiteSpace(search))
        {
            string s = search.Trim().ToLower();
            
            query = query.Where(l => 
                (l.EntityName != null && l.EntityName.ToLower().Contains(s)) || 
                (l.Action != null && l.Action.ToLower().Contains(s)) ||
                // Search by the Admin's FullName
                (l.AdminUser != null && l.AdminUser.FullName.ToLower().Contains(s)) ||
                // Fallback to searching the ID string
                (l.PerformedBy != null && l.PerformedBy.ToLower().Contains(s)));
        }

        // 4. Count total matches
        int totalCount = await query.CountAsync();

        // 5. Paginate and Execute
        var logs = await query
            .OrderByDescending(l => l.Timestamp)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (logs, totalCount);
    }

    public async Task<IEnumerable<AuditLog>> GetLogsByEntityAsync(string entityName)
    {
        return await _context.AuditLogs
            .Include(l => l.AdminUser) // Keep consistency
            .Where(l => l.EntityName == entityName)
            .OrderByDescending(l => l.Timestamp)
            .ToListAsync();
    }
}