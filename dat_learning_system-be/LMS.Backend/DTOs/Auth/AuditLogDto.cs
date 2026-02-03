namespace LMS.Backend.DTOs.Audit;
public record GlobalAuditLogDto(
    Guid Id,
    string EntityName,
    Guid EntityId,
    string Action,
    string PerformedBy,
    string? Reason,
    DateTime Timestamp,
    string? OldData,
    string? NewData
);