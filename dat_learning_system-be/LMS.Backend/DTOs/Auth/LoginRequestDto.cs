namespace LMS.Backend.DTOs.Auth;

public class LoginRequestDto
{
    public string CompanyCode { get; set; } = null!;
    public string Password { get; set; } = null!;

}