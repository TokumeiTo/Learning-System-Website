namespace LMS.Backend.DTOs.Auth;

public class LoginRequestDto
{
    public string CompanyCode { get; set; } = "";
    public string Password { get; set; } = "";

}