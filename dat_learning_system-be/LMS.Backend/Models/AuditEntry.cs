using LMS.Backend.Data.Entities;

namespace LMS.Backend.Data.Models;

public class AuditEntry
{
    public string EntityName { get; set; } = string.Empty;
    public string Action { get; set; } = string.Empty;
    public string EntityId { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; }
    public string? OldData { get; set; }
    public string? NewData { get; set; }
}