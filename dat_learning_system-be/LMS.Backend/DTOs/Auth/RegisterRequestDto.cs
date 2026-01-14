using LMS.Backend.Common;

namespace LMS.Backend.DTOs.Auth;

public class RegisterRequestDto
{
    public string CompanyCode { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public Position Position { get; set; }
    public int OrgUnitId { get; set; }
}