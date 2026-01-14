using LMS.Backend.DTOs.Auth;

namespace LMS.Backend.Services.Interfaces;

public interface IAuthService
{
    Task<RegisterResponseDto> RegisterAsync(RegisterRequestDto dto);
    Task<LoginResponseDto?> LoginAsync(LoginRequestDto dto);
}