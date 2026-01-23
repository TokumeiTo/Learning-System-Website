using LMS.Backend.Data.Entities;
using LMS.Backend.DTOs.OrgUnit;
using LMS.Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LMS.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "SuperAdmin")]
public class OrgUnitsController : ControllerBase
{
    private readonly IOrgUnitService _orgUnitService;

    public OrgUnitsController(IOrgUnitService orgUnitService)
    {
        _orgUnitService = orgUnitService;
    }

    [HttpGet]
    public async Task<IActionResult> GetHierarchy()
    {
        var result = await _orgUnitService.GetHierarchyAsync();
        return Ok(result);
    }

    [HttpGet("divisions")]
    public async Task<IActionResult> GetDivisions()
    {
        var result = await _orgUnitService.GetAllDivisions();
        return Ok(result);
    }

    [HttpGet("departments")]
    public async Task<IActionResult> GetDepartments()
    {
        var result = await _orgUnitService.GetAllDepartments();
        return Ok(result);
    }

    [HttpGet("sections")]
    public async Task<IActionResult> GetSections()
    {
        var result = await _orgUnitService.GetAllSections();
        return Ok(result);
    }

    [HttpGet("teams")]
    public async Task<IActionResult> GetTeams()
    {
        return Ok(await _orgUnitService.GetAllTeams());
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] OrgUnitRequestDto dto) // Use DTO here
    {
        var success = await _orgUnitService.CreateUnitAsync(dto);
        if (!success) return BadRequest("Invalid Parent Unit or Data");

        return Ok(new { message = "OrgUnit created successfully" });
    }
}