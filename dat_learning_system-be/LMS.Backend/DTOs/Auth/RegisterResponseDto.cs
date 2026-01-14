namespace LMS.Backend.DTOs.Auth;

public class RegisterResponseDto
{
    public bool IsSuccess { get; set; }
    public string Message { get; set; } = string.Empty;
    public string? CompanyCode { get; set; }
    public string UserPosition { get; set; } = null!;
}