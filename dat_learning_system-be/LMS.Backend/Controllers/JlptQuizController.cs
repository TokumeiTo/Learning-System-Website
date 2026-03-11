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
[Authorize] // Requires login for all quiz actions
public class JlptQuizController : ControllerBase
{
    private readonly IJlptQuizService _quizService;
    private readonly IJlptQuizRepository _repo;
    private readonly AppDbContext _context;

    public JlptQuizController(IJlptQuizService quizService, IJlptQuizRepository repo, AppDbContext context)
    {
        _quizService = quizService;
        _repo = repo;
        _context = context;
    }

    [HttpGet("list/{level}/{category}")]
    public async Task<ActionResult<List<JlptTestDto>>> GetAvailableTests(string level, string category)
    {
        var tests = await _quizService.GetAvailableTestsAsync(level, category);
        return Ok(tests);
    }

    [HttpPost("start/{testId}")]
    public async Task<ActionResult<int>> StartQuiz(Guid testId)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        var session = new QuizSession
        {
            TestId = testId,
            UserId = userId,
            StartedAt = DateTime.UtcNow
        };

        var createdSession = await _repo.StartSessionAsync(session);
        return Ok(createdSession.Id);
    }

    [HttpGet("questions/{testId}")]
    public async Task<ActionResult<List<QuizQuestionDto>>> GetQuestions(Guid testId)
    {
        var questions = await _quizService.GetQuestionsForTestAsync(testId);
        if (questions == null || !questions.Any()) return NotFound("No questions found for this test.");

        return Ok(questions);
    }

    [HttpPost("submit")]
    public async Task<ActionResult<QuizResultDto>> SubmitQuiz([FromBody] QuizSubmissionDto submission)
    {
        try
        {
            var result = await _quizService.SubmitQuizAsync(submission);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("history")]
    public async Task<ActionResult<List<QuizSession>>> GetMyHistory([FromQuery] string? category)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        var history = await _repo.GetUserHistoryAsync(userId, category);
        return Ok(history);
    }

    [Authorize(Roles = "Admin,SuperAdmin")]
    [HttpPost("create-jlpt-test")]
    public async Task<IActionResult> CreateJlptTest([FromBody] JlptTestDto dto)
    {
        var test = new Test // Using your actual Entity class
        {
            Id = Guid.NewGuid(),
            Title = dto.Title,
            JlptLevel = dto.JlptLevel,
            Category = dto.Category,
            PassingGrade = dto.PassingGrade,
            IsActive = true,
            // LessonContentId remains null for standalone JLPT quizzes
        };

        _context.Tests.Add(test);
        await _context.SaveChangesAsync();
        return Ok(test.Id);
    }
    [Authorize(Roles = "Admin,SuperAdmin")]
    [HttpPost("admin/add-question/{testId}")]
    public async Task<IActionResult> AddQuestionToTest(Guid testId, [FromBody] AdminQuestionDto dto)
    {
        var test = await _context.Tests.Include(t => t.QuizItems).FirstOrDefaultAsync(t => t.Id == testId);
        if (test == null) return NotFound("Test container not found.");

        // 1. For GrammarStar/Custom questions, we save the prompt/options directly into QuizItem
        // because they don't always point to a single 'Vocabulary' ID.
        var newItem = new QuizItem
        {
            Id = Guid.NewGuid(),
            TestId = testId,
            DisplayMode = (QuizDisplayMode)dto.DisplayMode,
            Points = dto.Points,
            SortOrder = (test.QuizItems?.Count ?? 0) + 1,

            // We store the Star Puzzle parts or Custom Prompt here
            CustomPrompt = dto.DisplayMode == (int)QuizDisplayMode.GrammarStar
                ? string.Join("|", dto.Options) // Store parts as "A|B|C|D"
                : dto.Prompt,

            // If this were a simple Kanji match, we'd find a SourceId. 
            // For now, we'll keep SourceId as a dummy Guid or Null if your DB allows.
            SourceId = Guid.NewGuid().ToString()
        };

        _context.QuizItems.Add(newItem);
        await _context.SaveChangesAsync();

        return Ok(new { Message = "Question added", ItemId = newItem.Id });
    }
}