using LMS.Backend.DTOs.Classroom;
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
}