namespace LMS.Backend.DTOs.Auth;

public class AuthResponseDto
{
    public string FullName {get;set;} =null!;
    public string Token {get;set;} =null!;
    public string Email {get;set;} =null!;

}