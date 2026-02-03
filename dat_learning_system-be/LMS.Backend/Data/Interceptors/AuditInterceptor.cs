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
    private const string AuditReasonKey = "AuditReason";

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

        // 1. Capture User ID from Claims
        var currentUserId = _httpContextAccessor.HttpContext?.User?
            .FindFirst(ClaimTypes.NameIdentifier)?.Value;

        // 2. Extract Reason from HttpContext.Items (Set in Service)
        // Defaults to "None" if not provided or HttpContext is null
        var reason = _httpContextAccessor.HttpContext?.Items[AuditReasonKey]?.ToString() ?? "None";

        var auditEntries = OnBeforeSaveChanges(eventData.Context);
        
        foreach (var entry in auditEntries)
        {
            eventData.Context.Set<AuditLog>().Add(new AuditLog
            {
                Id = Guid.NewGuid(),
                EntityName = entry.EntityName,
                EntityId = entry.EntityId,
                Action = entry.Action,
                OldData = entry.OldData,
                NewData = entry.NewData,
                Timestamp = entry.Timestamp,
                PerformedBy = currentUserId,
                Reason = reason // Reason captured here
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

            // Improved: Capture data for Added and Deleted states as well
            if (entry.State == EntityState.Modified)
            {
                auditEntry.OldData = JsonSerializer.Serialize(entry.OriginalValues.ToObject());
                auditEntry.NewData = JsonSerializer.Serialize(entry.CurrentValues.ToObject());
            }
            else if (entry.State == EntityState.Added)
            {
                auditEntry.NewData = JsonSerializer.Serialize(entry.CurrentValues.ToObject());
            }
            else if (entry.State == EntityState.Deleted)
            {
                auditEntry.OldData = JsonSerializer.Serialize(entry.OriginalValues.ToObject());
            }
            
            auditEntries.Add(auditEntry);
        }
        return auditEntries;
    }
}