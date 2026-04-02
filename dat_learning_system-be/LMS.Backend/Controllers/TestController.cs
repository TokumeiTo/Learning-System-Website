using System.Security.Claims;
using AutoMapper;
using LMS.Backend.DTOs.Test_Quest;
using LMS.Backend.Repo.Interface;
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
    private readonly ITestRepository _testRepo;
    private readonly IMapper _mapper;

    public TestController(ITestService testService, ILessonAttemptService attemptService, ITestRepository testRepo, IMapper mapper)
    {
        _testRepo = testRepo;
        _testService = testService;
        _attemptService = attemptService;
        _mapper = mapper;
    }

    [HttpPost("content/{contentId}")]
    [Authorize(Roles = "SuperAdmin,Admin")]
    public async Task<IActionResult> SaveTest(Guid? contentId, [FromBody] TestDto dto)
    {
        // Service handles the "Sync" logic (check if ID exists -> Update; if not -> Add)
        var result = await _testService.SaveTestAsync(contentId, dto);
        return result ? Ok(new { message = "Test updated relationally." }) : BadRequest("Failed to save test.");
    }

    [HttpPost("quiz")]
    [Authorize(Roles = "SuperAdmin,Admin")]
    public async Task<IActionResult> SaveGlobalTest([FromBody] TestDto dto)
    {
        // Pass null for contentId to indicate this is a global quiz
        var result = await _testService.SaveTestAsync(null, dto);
        return result ? Ok(new { message = "Global quiz saved." }) : BadRequest();
    }

    [HttpPost("submit")]
    public async Task<ActionResult<QuizResultDto>> SubmitLesson([FromBody] QuizSubmissionDto submission)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        // This triggers the grading, attempt record, and progress marking
        var result = await _testService.GradQuizAsync(userId, submission);
        return Ok(result);
    }

    // Hidden Correct Answers
    [HttpGet("{testId}")]
    public async Task<ActionResult<TestDto>> GetQuiz(Guid testId)
    {
        var test = await _testRepo.GetTestByIdWithAnswersAsync(testId);
        if (test == null) return NotFound();

        // Security: We do NOT pass "IsAdmin" to the mapper here.
        // The OptionDto.IsCorrect will be null in the JSON result.
        var testDto = _mapper.Map<TestDto>(test);
        return Ok(testDto);
    }

    // --- KPI & HISTORY ENDPOINTS ---

  [HttpGet("my-history")]
public async Task<ActionResult<List<QuizResultDto>>> GetHistory(
    [FromQuery] Guid? lessonId,
    [FromQuery] Guid? testId,
    [FromQuery] string? level) // Add this!
{
    var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
    if (string.IsNullOrEmpty(userId)) return Unauthorized();

    if (lessonId.HasValue) return Ok(await _attemptService.GetMyAttemptsByLessonAsync(userId, lessonId.Value));
    if (testId.HasValue) return Ok(await _attemptService.GetMyAttemptsByTestAsync(userId, testId.Value));
    
    // NEW: Fetch all history for a level to light up the dashboard
    if (!string.IsNullOrEmpty(level)) 
        return Ok(await _testService.GetMyAttemptsByLevelAsync(userId, level)); 

    return BadRequest("Must provide lessonId, testId, or level");
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

    // Global Fetch
    [HttpGet("practice")]
    [AllowAnonymous]
    public async Task<ActionResult<IEnumerable<TestDto>>> GetPracticeQuizzes([FromQuery] string level, [FromQuery] string category)
    {
        var tests = await _testRepo.GetGlobalQuizzesAsync(level, category);
        return Ok(_mapper.Map<IEnumerable<TestDto>>(tests));
    }

    [HttpGet("stats/{level}")]
    public async Task<IActionResult> GetGlobalStats(string level)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        // Calling the new Repo method
        var stats = await _testRepo.GetCategoryProgressAsync(userId, level);
        return Ok(stats);
    }
}