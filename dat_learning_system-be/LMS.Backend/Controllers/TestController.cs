using System.Security.Claims;
using LMS.Backend.DTOs.Test_Quest;
using LMS.Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LMS.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TestController : ControllerBase
{
    private readonly ITestService _testService;
    private readonly ILessonAttemptService _attemptService;

    public TestController(ITestService testService, ILessonAttemptService attemptService)
    {
        _testService = testService;
        _attemptService = attemptService;
    }

    [HttpPost("content/{contentId}")]
    [Authorize(Roles = "SuperAdmin,Admin")]
    public async Task<IActionResult> SaveTest(Guid contentId, [FromBody] TestDto dto)
    {
        // Service handles the "Sync" logic (check if ID exists -> Update; if not -> Add)
        var result = await _testService.SaveTestToContentAsync(contentId, dto);
        return result ? Ok(new { message = "Test updated relationally." }) : NotFound();
    }

    [HttpPost("submit")]
    public async Task<ActionResult<LessonResultDto>> SubmitLesson([FromBody] LessonSubmissionDto submission)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        // This triggers the grading, attempt record, and progress marking
        var result = await _testService.GradeLessonAsync(userId, submission);
        return Ok(result);
    }

    // --- KPI & HISTORY ENDPOINTS ---

    [HttpGet("my-attempts/{lessonId}")]
    public async Task<ActionResult<List<LessonResultDto>>> GetMyHistory(Guid lessonId)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        // Note: Using LessonResultDto to match the service return type for student views
        var history = await _attemptService.GetMyAttemptsAsync(userId, lessonId);
        return Ok(history);
    }

    [HttpGet("admin/stats/{lessonId}")]
    [Authorize(Roles = "SuperAdmin,Admin")]
    public async Task<ActionResult<AdminLessonStatsDto>> GetLessonStats(Guid lessonId)
    {
        var stats = await _attemptService.GetLessonStatsForAdminAsync(lessonId);
        return Ok(stats);
    }

    [HttpGet("admin/kpi/department/{orgUnitId}")]
    [Authorize(Roles = "SuperAdmin,Admin")]
    public async Task<ActionResult<List<StudentPerformanceDto>>> GetDepartmentKpi(int orgUnitId)
    {
        var kpi = await _attemptService.GetDepartmentKpiAsync(orgUnitId);
        return Ok(kpi);
    }
}