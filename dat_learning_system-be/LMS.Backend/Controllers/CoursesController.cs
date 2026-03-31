using LMS.Backend.DTOs.Course;
using LMS.Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LMS.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CoursesController : ControllerBase
{
    private readonly ICourseService _courseService;

    public CoursesController(ICourseService courseService)
    {
        _courseService = courseService;
    }

    [HttpPost]
    [Authorize(Roles = "SuperAdmin,Admin")]
    public async Task<IActionResult> Create([FromForm] CreateCourseDto dto)
    {
        // For now, we hardcode a creator ID until we finish Auth
        var result = await _courseService.CreateCourseAsync(dto, "admin-system");
        return Ok(result);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "SuperAdmin,Admin")]
    public async Task<IActionResult> Update(Guid id, [FromForm] UpdateCourseDto dto)
    {
        var result = await _courseService.UpdateCourseAsync(id, dto);
        return Ok(result);
    }

    // DELETE: api/courses/{id} (Soft Delete)
    [HttpDelete("{id}")]
    [Authorize(Roles = "SuperAdmin,Admin")]
    public async Task<IActionResult> SoftDelete(Guid id)
    {
        await _courseService.SoftDeleteCourseAsync(id);
        return NoContent();
    }

    // DELETE: api/courses/{id}/purge (Hard Delete)
    [HttpDelete("{id}/purge")]
    [Authorize(Roles = "SuperAdmin,Admin")]
    public async Task<IActionResult> HardDelete(Guid id)
    {
        await _courseService.HardDeleteCourseAsync(id);
        return NoContent();
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        bool isAdmin = User.IsInRole("Admin");
        var courses = await _courseService.GetAllCoursesAsync(isAdmin);
        return Ok(courses);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var course = await _courseService.GetCourseByIdAsync(id);
        if (course == null) return NotFound();

        return Ok(course);
    }
}