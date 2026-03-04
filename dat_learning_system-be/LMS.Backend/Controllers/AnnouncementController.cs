using LMS.Backend.Common;
using LMS.Backend.DTOs.Announce_Noti;
using LMS.Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace LMS.Backend.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class AnnouncementController(IAnnouncementService service) : ControllerBase
{
    // FOR USERS: Get active announcements for my position
    [HttpGet]
    public async Task<IActionResult> GetMyAnnouncements()
    {
        // Extract position from claims (set during login)
        var positionStr = User.FindFirst("Position")?.Value;
        if (!Enum.TryParse<Position>(positionStr, out var position))
            position = Position.Employee; // Default fallback

        var results = await service.GetForUserAsync(position);
        return Ok(results);
    }

    // FOR ADMINS: Get all (past, present, future) for management
    [HttpGet("admin")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    public async Task<IActionResult> GetAllForAdmin()
    {
        var results = await service.GetAllForAdminAsync();
        return Ok(results);
    }

    // UPSERT: Manual Sync Logic (Check ID exists -> Update; Else -> Add)
    [HttpPost]
    [Authorize(Roles = "Admin,SuperAdmin")]
    public async Task<IActionResult> Upsert(UpsertAnnouncementDto dto)
    {
        var adminId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "System";
        await service.UpsertAsync(dto, adminId);
        return Ok(new { Message = "Announcement synced successfully." });
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await service.DeleteAsync(id);
        return NoContent();
    }
}