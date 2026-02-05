namespace LMS.Backend.DTOs.User;

public class UserResponseDto
{
    public string Id { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string CompanyCode { get; set; } = string.Empty;
    public string PositionName { get; set; } = string.Empty; // "DivHead"
    public int Position { get; set; } // 1
    public string? OrgUnitName { get; set; }
    public int? OrgUnitId { get; set; }
}