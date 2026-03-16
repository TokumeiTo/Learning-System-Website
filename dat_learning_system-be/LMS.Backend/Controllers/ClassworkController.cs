using LMS.Backend.DTOs.Classwork;
using LMS.Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace LMS.Backend.Controllers;

[Authorize]
[Route("api/[controller]")]
[ApiController]
public class ClassworkController(IClassworkService service) : ControllerBase
{
    // --- TOPIC ENDPOINTS ---

    [HttpPost("topics")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ClassworkTopicDto>> CreateTopic([FromBody] CreateClassworkTopicDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? string.Empty;
        var result = await service.AddTopicAsync(dto, userId);
        return Ok(result);
    }

    [HttpGet("course/{courseId}")]
    public async Task<ActionResult<List<ClassworkTopicDto>>> GetClasswork(Guid courseId)
    {
        // Get the ID of the person making the request
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        var result = await service.GetCourseClassworkAsync(courseId, userId);
        return Ok(result);
    }

    [HttpDelete("topics/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteTopic(Guid id)
    {
        var result = await service.RemoveTopicAsync(id);
        if (!result) return NotFound();
        return NoContent();
    }

    // --- ITEM ENDPOINTS (Assignments/Resources) ---

    [HttpPost("items")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ClassworkItemDto>> CreateItem([FromBody] CreateClassworkItemDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? string.Empty;
        var result = await service.AddClassworkItemAsync(dto, userId);
        return Ok(result);
    }

    [HttpDelete("items/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteItem(Guid id)
    {
        var result = await service.RemoveItemAsync(id);
        if (!result) return NotFound();
        return NoContent();
    }

    // --- SUBMISSION ENDPOINTS ---

    [HttpPost("submit")]
    public async Task<ActionResult<ClassworkSubmissionDto>> SubmitWork([FromBody] SubmitClassworkDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? string.Empty;
        var result = await service.SubmitWorkAsync(dto, userId);
        return Ok(result);
    }

    // --- GRADING ENDPOINTS ---

    [HttpPut("submissions/{id}/grade")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ClassworkSubmissionDto>> GradeSubmission(Guid id, [FromBody] GradeSubmissionRequest request)
    {
        var result = await service.GradeSubmissionAsync(id, request.Grade, request.Feedback);
        return Ok(result);
    }
}

// Simple internal DTO for grading requests
public record GradeSubmissionRequest(double Grade, string? Feedback);