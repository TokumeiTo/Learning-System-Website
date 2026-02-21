using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using LMS.Backend.Services.Interfaces;
using LMS.Backend.DTOs.Rating;

namespace LMS.Backend.API.Controllers;

[Authorize] // Must be logged in to rate
[ApiController]
[Route("api/[controller]")]
public class CourseRatingController : ControllerBase
{
    private readonly ICourseRatingService _ratingService;

    public CourseRatingController(ICourseRatingService ratingService)
    {
        _ratingService = ratingService;
    }

    [HttpPost("{courseId}")]
    public async Task<IActionResult> RateCourse(Guid courseId, [FromBody] SubmitRatingDto dto)
    {
        // 1. Get User ID from Token
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        try
        {
            // 2. Call Service (This handles the Guard, Upsert, and Cache Sync)
            var result = await _ratingService.SubmitRatingAsync(courseId, userId, dto.Score, dto.Comment);

            if (result) return Ok(new { message = "Rating submitted successfully!" });
            
            return BadRequest("Failed to submit rating.");
        }
        catch (UnauthorizedAccessException ex)
        {
            // This catches the "Not Approved" guard we wrote in the Service
            return Forbid(ex.Message);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }
}