using LMS.Backend.Data.Entities;
using LMS.Backend.DTOs.Schedule;
using LMS.Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace LMS.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ScheduleController(
    IScheduleService scheduleService, 
    UserManager<ApplicationUser> userManager
    ) : ControllerBase
{
    // --- USER ENDPOINTS ---

    [HttpGet("my-schedule")]
    public async Task<ActionResult<IEnumerable<SchedulePlanDto>>> GetMySchedule([FromQuery] DateTime date)
    {
        var user = await userManager.GetUserAsync(User);
        if (user == null) return Unauthorized();

        // The service handles the filtering by Position, CompanyCode, and IsPublic
        var schedules = await scheduleService.GetSchedulesForUserAsync(user, date);
        return Ok(schedules);
    }

    // --- ADMIN ENDPOINTS ---

    [HttpGet("admin/all")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    public async Task<ActionResult<IEnumerable<SchedulePlanDto>>> GetAllPlans()
    {
        var schedules = await scheduleService.GetAllSchedulesForAdminAsync();
        return Ok(schedules);
    }

    [HttpPost("admin/create")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    public async Task<IActionResult> CreatePlan([FromBody] SchedulePlanUpsertDto dto)
    {
        var adminId = userManager.GetUserId(User);
        if (string.IsNullOrEmpty(adminId)) return Unauthorized();

        await scheduleService.CreateScheduleAsync(dto, adminId);
        return Ok(new { message = "Schedule plan created successfully" });
    }

    [HttpPut("admin/{id}")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    public async Task<IActionResult> UpdatePlan(Guid id, [FromBody] SchedulePlanUpsertDto dto)
    {
        await scheduleService.UpdateScheduleAsync(id, dto);
        return Ok(new { message = "Schedule updated successfully" });
    }

    [HttpDelete("admin/{id}")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    public async Task<IActionResult> DeletePlan(Guid id)
    {
        await scheduleService.DeleteAsync(id);
        return Ok(new { message = "Schedule deleted successfully" });
    }
}