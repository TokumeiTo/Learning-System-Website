namespace LMS.Backend.DTOs.Auth;

public class LoginResponseDto
{
    public string Id {get; set;} = "Unknown ID";
    public string Token { get; set; } = "No Token available";
    public string FullName { get; set; } = "Unknown FullName";
    public string Position { get; set; } = "Unknown Position";
    public string Email { get; set; } = "Unknown Email";
}