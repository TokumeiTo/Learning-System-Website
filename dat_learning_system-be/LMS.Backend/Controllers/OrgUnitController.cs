using LMS.Backend.Data.Entities;
using LMS.Backend.DTOs.OrgUnit;
using LMS.Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LMS.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "SuperAdmin")]
public class OrgUnitController : ControllerBase
{
    private readonly IOrgUnitService _orgUnitService;

    public OrgUnitController(IOrgUnitService orgUnitService)
    {
        _orgUnitService = orgUnitService;
    }

    [HttpGet]
    public async Task<IActionResult> GetHierarchy()
    {
        var result = await _orgUnitService.GetHierarchyAsync();
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] OrgUnitRequestDto dto) // Use DTO here
    {
        var success = await _orgUnitService.CreateUnitAsync(dto);
        if (!success) return BadRequest("Invalid Parent Unit or Data");

        return Ok(new { message = "OrgUnit created successfully" });
    }
}