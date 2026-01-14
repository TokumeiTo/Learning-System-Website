using LMS.Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace LMS.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize] // Requires JWT
public class UserController : ControllerBase
{
    private readonly IUserService _userService;

    public UserController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpGet("list")]
    public async Task<IActionResult> GetUsers()
    {
        // Get the ID of the user making the request from the JWT Token
        var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        
        if (string.IsNullOrEmpty(currentUserId)) return Unauthorized();

        var users = await _userService.GetUsersByScopeAsync(currentUserId);
        return Ok(users);
    }
}