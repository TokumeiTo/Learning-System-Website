using System.Security.Claims;
using LMS.Backend.DTOs.Enrollment;
using LMS.Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LMS.Backend.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class EnrollmentController : ControllerBase
{
    private readonly IEnrollmentService _service;

    public EnrollmentController(IEnrollmentService service)
    {
        _service = service;
    }

    /// <summary>
    /// Checks if the current user is enrolled in a specific course.
    /// Used by the React CourseDetailModal to toggle buttons.
    /// </summary>
    [HttpGet("status/{courseId}")]
    public async Task<ActionResult<EnrollmentStatusResponseDto>> GetStatus(Guid courseId)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        var result = await _service.GetUserEnrollmentStatusAsync(courseId, userId);
        return Ok(result);
    }

    /// <summary>
    /// Student requests to join a course.
    /// </summary>
    [HttpPost("request")]
    public async Task<IActionResult> RequestEnroll([FromBody] SubmitEnrollmentDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        var result = await _service.RequestEnrollmentAsync(dto.CourseId, userId!);

        if (!result)
            return BadRequest(new { message = "Request already exists or course is unavailable." });

        return Ok(new { message = "Enrollment request submitted successfully." });
    }

    /// <summary>
    /// Admin views all 'Pending' requests for approval.
    /// </summary>
    [HttpGet("pending")]
    [Authorize(Roles = "SuperAdmin,Admin")]
    public async Task<ActionResult<IEnumerable<EnrollmentRequestDto>>> GetPending()
    {
        var requests = await _service.GetPendingQueueAsync();
        return Ok(requests);
    }

    /// <summary>
    /// Admin Approves or Rejects a request with an optional reason.
    /// </summary>
    [HttpPatch("respond/{id}")]
    [Authorize(Roles = "SuperAdmin,Admin")]
    public async Task<IActionResult> Respond(Guid id, [FromBody] EnrollmentResponseRequest request)
    {
        // Now request.Approve and request.Reason will be correctly populated from the Body
        var result = await _service.RespondToRequestAsync(id, request.Approve, request.Reason);

        if (!result)
            return NotFound(new { message = "Enrollment record not found or already processed." });

        return Ok(new { message = $"Enrollment has been {(request.Approve ? "Approved" : "Rejected")}." });
    }

    [HttpGet("history")]
    [Authorize(Roles = "SuperAdmin,Admin")]
    public async Task<IActionResult> GetHistory()
    => Ok(await _service.GetHistoryAsync());
}