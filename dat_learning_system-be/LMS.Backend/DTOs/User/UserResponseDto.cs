namespace LMS.Backend.DTOs.User;

public class UserResponseDto
{
    public string Id { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string CompanyCode { get; set; } = string.Empty;
    public string Position { get; set; } = string.Empty;
    public string? OrgUnitName { get; set; }
    public int? OrgUnitId { get; set; }
}