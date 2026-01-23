using LMS.Backend.Common;

namespace LMS.Backend.DTOs.Auth;

public class RegisterRequestDto
{
    public string CompanyCode { get; set; } = null!;
    public string FullName { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string Password { get; set; } = null!;
    public Position Position { get; set; }
    public int OrgUnitId { get; set; }
}