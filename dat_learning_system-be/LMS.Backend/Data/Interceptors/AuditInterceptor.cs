using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using System.Text.Json;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using LMS.Backend.Data.Entities;
using LMS.Backend.Data.Models;

namespace LMS.Backend.Data.Interceptors;

public class AuditInterceptor : SaveChangesInterceptor
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public AuditInterceptor(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public override ValueTask<InterceptionResult<int>> SavingChangesAsync(
        DbContextEventData eventData, 
        InterceptionResult<int> result, 
        CancellationToken cancellationToken = default)
    {
        if (eventData.Context == null) return base.SavingChangesAsync(eventData, result, cancellationToken);

        // Capture User ID from HttpContext
        var userIdStr = _httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var currentUserId = _httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        var auditEntries = OnBeforeSaveChanges(eventData.Context);
        
        foreach (var entry in auditEntries)
        {
            eventData.Context.Set<AuditLog>().Add(new AuditLog
            {
                EntityName = entry.EntityName,
                EntityId = entry.EntityId,
                Action = entry.Action,
                OldData = entry.OldData,
                NewData = entry.NewData,
                Timestamp = entry.Timestamp,
                PerformedBy = currentUserId // Correctly linking the Admin ID
            });
        }

        return base.SavingChangesAsync(eventData, result, cancellationToken);
    }

    private List<AuditEntry> OnBeforeSaveChanges(DbContext context)
    {
        context.ChangeTracker.DetectChanges();
        var auditEntries = new List<AuditEntry>();

        foreach (var entry in context.ChangeTracker.Entries())
        {
            if (entry.Entity is AuditLog || entry.State == EntityState.Detached || entry.State == EntityState.Unchanged)
                continue;

            var auditEntry = new AuditEntry
            {
                EntityName = entry.Entity.GetType().Name,
                Action = entry.State.ToString(),
                Timestamp = DateTime.UtcNow,
                EntityId = entry.Properties.FirstOrDefault(p => p.Metadata.IsPrimaryKey())?.CurrentValue?.ToString() ?? "New"
            };

            if (entry.State == EntityState.Modified)
            {
                auditEntry.OldData = JsonSerializer.Serialize(entry.OriginalValues.ToObject());
                auditEntry.NewData = JsonSerializer.Serialize(entry.CurrentValues.ToObject());
            }
            
            auditEntries.Add(auditEntry);
        }
        return auditEntries;
    }
}