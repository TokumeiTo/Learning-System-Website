using LMS.Backend.Common;
using LMS.Backend.Data.Dbcontext;
using LMS.Backend.Data.Entities;
using LMS.Backend.DTOs.Test_Quest;
using LMS.Backend.Repo.Interface;
using LMS.Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace LMS.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class JlptQuizController : ControllerBase
{
    private readonly IJlptQuizService _quizService;
    private readonly AppDbContext _context;

    public JlptQuizController(IJlptQuizService quizService, AppDbContext context)
    {
        _quizService = quizService;
        _context = context;
    }

    [HttpGet("tests")]
    public async Task<ActionResult<List<JlptTestDto>>> GetTests([FromQuery] string level, [FromQuery] string category)
        => Ok(await _quizService.GetAvailableTestsAsync(level, category));

    [HttpPost("submit")]
    public async Task<ActionResult<QuizResultDto>> SubmitQuiz([FromBody] QuizSubmissionDto submission)
    {
        // Service handles the score calculation and history logging
        var result = await _quizService.SubmitQuizAsync(submission);
        return Ok(result);
    }

    // --- ADMIN SECTION ---

    [Authorize(Roles = "Admin")]
    [HttpPost("admin/create-test")]
    public async Task<IActionResult> CreateTest([FromBody] JlptTestDto dto)
    {
        var test = new Test
        {
            Id = Guid.NewGuid(),
            Title = dto.Title,
            JlptLevel = dto.JlptLevel,
            Category = dto.Category,
            PassingGrade = dto.PassingGrade,
            IsActive = true
        };

        _context.Tests.Add(test);
        await _context.SaveChangesAsync();
        return Ok(test.Id);
    }

    [Authorize(Roles = "Admin,SuperAdmin")]
    [HttpPost("admin/add-item")]
    public async Task<IActionResult> AddQuizItem([FromBody] LinkQuestionDto dto)
    {
        // 1. Fetch the test with existing items to check for duplicates
        var test = await _context.Tests
            .Include(t => t.QuizItems)
            .FirstOrDefaultAsync(t => t.Id == dto.TestId);

        if (test == null) return NotFound("Target test not found.");

        // 2. Manual Sync: Check if this source (Kanji/Vocab/Grammar) is already in this test
        var existingItem = test.QuizItems?
            .FirstOrDefault(x => x.SourceId == dto.SourceId);

        if (existingItem != null)
        {
            // UPDATE existing record
            existingItem.DisplayMode = (QuizDisplayMode)dto.DisplayMode;
            existingItem.CustomPrompt = dto.CustomPrompt;
            existingItem.Points = dto.Points;

            _context.QuizItems.Update(existingItem);
        }
        else
        {
            // ADD new record
            var newItem = new QuizItem
            {
                Id = Guid.NewGuid(),
                TestId = dto.TestId,
                SourceId = dto.SourceId,
                DisplayMode = (QuizDisplayMode)dto.DisplayMode,
                CustomPrompt = dto.CustomPrompt,
                Points = dto.Points,
                SortOrder = (test.QuizItems?.Count ?? 0) + 1
            };

            _context.QuizItems.Add(newItem);
        }

        await _context.SaveChangesAsync();
        return Ok(new { Message = existingItem != null ? "Updated" : "Added" });
    }

    [HttpPost("start/{testId}")]
    [HttpPost("start/{testId}")]
public async Task<ActionResult<int>> StartQuiz(Guid testId)
{
    var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
    if (string.IsNullOrEmpty(userId)) return Unauthorized();

    var session = new QuizSession
    {
        TestId = testId,
        UserId = userId,
        StartedAt = DateTime.UtcNow,
        FinalScore = 0,
        IsPassed = false
    };

    _context.QuizSessions.Add(session);
    await _context.SaveChangesAsync();

    // session.Id is now populated with the auto-incremented int
    return Ok(session.Id); 
}
}