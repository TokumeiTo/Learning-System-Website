using System.Security.Claims;
using LMS.Backend.DTOs.Test_Quest;
using LMS.Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LMS.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize] // Requires login for all actions
public class TestController : ControllerBase
{
    private readonly ITestService _testService;

    public TestController(ITestService testService)
    {
        _testService = testService;
    }

    /// <summary>
    /// ADMIN: Save or Update a test block within a lesson content.
    /// </summary>
    [HttpPost("content/{contentId}")]
    [Authorize(Roles = "Admin")] // Only Admins can create/edit tests
    public async Task<IActionResult> SaveTest(Guid contentId, [FromBody] TestDto dto)
    {
        if (dto == null) return BadRequest("Test data is required.");

        var result = await _testService.SaveTestToContentAsync(contentId, dto);
        
        return result 
            ? Ok(new { message = "Test saved successfully" }) 
            : BadRequest("Failed to save test.");
    }

    /// <summary>
    /// STUDENT: Submit answers for the entire lesson to get graded.
    /// </summary>
    [HttpPost("submit")]
    public async Task<ActionResult<LessonResultDto>> SubmitLesson([FromBody] LessonSubmissionDto submission)
    {
        // Get the logged-in User's ID from the JWT Claims
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        
        if (string.IsNullOrEmpty(userId)) 
            return Unauthorized("User ID not found in token.");

        if (submission.LessonId == Guid.Empty)
            return BadRequest("Invalid Lesson ID.");

        // Grade the lesson and update progress automatically
        var result = await _testService.GradeLessonAsync(userId, submission);

        return Ok(result);
    }
}