using System.Security.Claims;
using LMS.Backend.DTOs.Lesson;
using LMS.Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LMS.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize] // Must be logged in to track progress
public class LessonProgressController : ControllerBase
{
    private readonly IUserProgressService _progressService;

    public LessonProgressController(IUserProgressService progressService)
    {
        _progressService = progressService;
    }

    [HttpPatch("heartbeat")]
    public async Task<IActionResult> TrackHeartbeat([FromBody] ProgressRequestDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        var success = await _progressService.UpdateHeartbeatAsync(userId, dto);

        if (!success) return BadRequest(new { message = "Invalid tracking data" });

        return Ok(new { message = "Progress updated" });
    }

    [HttpPost("{lessonId}/complete")]
    public async Task<IActionResult> MarkComplete(Guid lessonId)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        await _progressService.MarkAsCompleteAsync(userId!, lessonId);
        return Ok(new { message = "Lesson finished!" });
    }

    [HttpGet("{lessonId}")]
    public async Task<IActionResult> GetMyProgress(Guid lessonId)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var progress = await _progressService.GetLessonProgressAsync(userId!, lessonId);

        // If no progress yet, return a clean "zeroed" DTO or 204 No Content
        if (progress == null) return Ok(new { timeSpentSeconds = 0, isCompleted = false });

        return Ok(progress);
    }
}