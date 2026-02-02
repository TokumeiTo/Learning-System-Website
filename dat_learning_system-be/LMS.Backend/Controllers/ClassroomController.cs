using LMS.Backend.DTOs.Classroom;
using LMS.Backend.DTOs.Lesson;
using LMS.Backend.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace LMS.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ClassroomController(ILessonService lessonService) : ControllerBase
{
    [HttpGet("{courseId}")]
    public async Task<ActionResult<ClassroomViewDto>> GetClassroom(Guid courseId)
    {
        var result = await lessonService.GetClassroomViewAsync(courseId);
        if (result == null) return NotFound();
        return Ok(result);
    }

    [HttpPost("lessons")]
    public async Task<ActionResult<ClassroomLessonDto>> CreateLesson([FromBody] CreateLessonDto dto)
    {
        try
        {
            var result = await lessonService.CreateLessonAsync(dto);
            return CreatedAtAction(nameof(CreateLesson), new { id = result.Id }, result);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost("lessons/contents/bulk")]
    public async Task<IActionResult> BulkSaveContents([FromBody] SaveLessonContentsDto dto)
    {
        await lessonService.BulkSaveContentsAsync(dto);
        return NoContent();
    }

    [HttpPut("lessons/reorder")]
    public async Task<IActionResult> ReorderLessons([FromBody] ReorderLessonsDto dto)
    {
        await lessonService.ReorderLessonsAsync(dto);
        return NoContent();
    }

    [HttpPut("lessons/{id}")]
    public async Task<ActionResult<ClassroomLessonDto>> UpdateLesson(Guid id, [FromBody] UpdateLessonDto dto)
    {
        if (id != dto.Id) return BadRequest("ID mismatch");

        try
        {
            var result = await lessonService.UpdateLessonAsync(dto);
            return Ok(result);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpDelete("lessons/{id}")]
    public async Task<IActionResult> DeleteLesson(Guid id)
    {
        var deleted = await lessonService.DeleteLessonAsync(id);
        if (!deleted) return NotFound();

        return NoContent();
    }
}