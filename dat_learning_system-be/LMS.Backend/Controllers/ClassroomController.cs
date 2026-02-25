using LMS.Backend.DTOs.Classroom;
using LMS.Backend.DTOs.Lesson;
using LMS.Backend.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace LMS.Backend.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ClassroomController(ILessonService lessonService) : ControllerBase
{
    // --- STUDENT & ADMIN VIEW ---
    [HttpGet("{courseId}")]
    public async Task<ActionResult<ClassroomViewDto>> GetClassroom(Guid courseId)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        var result = await lessonService.GetClassroomViewAsync(courseId, userId);
        if (result == null) return NotFound();
        
        return Ok(result);
    }

    // --- NEW: STUDENT QUIZ SUBMISSION ---
    [HttpPost("lessons/quiz/submit")]
    public async Task<ActionResult<QuizResultDto>> SubmitQuiz([FromBody] SubmitQuizDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        // This triggers the grading, attempt recording, and progress logic
        var result = await lessonService.SubmitQuizAsync(userId, dto);
        return Ok(result);
    }

    // --- ADMIN ONLY OPERATIONS ---

    [HttpPost("lessons")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ClassroomLessonDto>> CreateLesson([FromBody] CreateLessonDto dto)
    {
        var result = await lessonService.CreateLessonAsync(dto);
        // Using courseId from result to be safe
        return CreatedAtAction(nameof(GetClassroom), new { courseId = result.CourseId }, result);
    }

    [HttpPost("lessons/contents/bulk")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> BulkSaveContents([FromBody] SaveLessonContentsDto dto)
    {
        await lessonService.BulkSaveContentsAsync(dto);
        return NoContent();
    }

    [HttpPut("lessons/reorder")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> ReorderLessons([FromBody] ReorderLessonsDto dto)
    {
        await lessonService.ReorderLessonsAsync(dto);
        return NoContent();
    }

    [HttpPut("lessons/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ClassroomLessonDto>> UpdateLesson(Guid id, [FromBody] UpdateLessonDto dto)
    {
        if (id != dto.Id) return BadRequest("ID mismatch");
        var result = await lessonService.UpdateLessonAsync(dto);
        return Ok(result);
    }

    [HttpDelete("lessons/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteLesson(Guid id)
    {
        var deleted = await lessonService.DeleteLessonAsync(id);
        return deleted ? NoContent() : NotFound();
    }
}