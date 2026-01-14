using LMS.Backend.DTOs.Auth;
using LMS.Backend.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace LMS.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequestDto dto)
    {
        var response = await _authService.LoginAsync(dto);
        if (response is null)
        {
            return Unauthorized(new { message = "Invalid Company Code or Password" });
        }

        return Ok(response);
    }
    [HttpPost("register")]
    // Later we can add [Authorize(Roles = "SuperAdmin")] to protect this
    public async Task<IActionResult> Register([FromBody] RegisterRequestDto dto)
    {
        var result = await _authService.RegisterAsync(dto);

        if (!result.IsSuccess)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }
}