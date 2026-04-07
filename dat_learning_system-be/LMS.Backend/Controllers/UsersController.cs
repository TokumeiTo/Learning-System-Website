using LMS.Backend.Common;
using LMS.Backend.DTOs.User;
using LMS.Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace LMS.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UserController : ControllerBase
{
    private readonly IUserService _userService;

    public UserController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpGet("list")]
    public async Task<IActionResult> GetUsers(
        [FromQuery] string? search,
        [FromQuery] int? unitId,
        [FromQuery] Position? position,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10
    )
    {
        var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(currentUserId)) return Unauthorized();

        var result = await _userService.GetUsersByScopeAsync(
            currentUserId,
            unitId,
            position,
            search,
            page,
            pageSize
        );

        return Ok(result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateUser(string id, [FromBody] UserUpdateRequestDto dto)
    {
        // Validation check
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var result = await _userService.UpdateUserAsync(id, dto);

        // If result is false, it could mean NotFound OR Forbidden (cross-company)
        return result ? Ok(new { message = "User updated successfully" }) : NotFound();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(string id, [FromBody] UserDeleteRequestDto dto)
    {
        var result = await _userService.DeleteUserAsync(id, dto);

        return result ? Ok(new { message = "User deleted successfully" }) : NotFound();
    }
}