using LMS.Backend.DTOs.RoadMap;
using LMS.Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LMS.Backend.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class RoadmapController(IRoadmapService roadmapService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<RoadmapResponseDto>>> GetAll()
    {
        return Ok(await roadmapService.GetRoadmapsAsync());
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<RoadmapResponseDto>> GetById(int id)
    {
        var result = await roadmapService.GetRoadmapByIdAsync(id);
        if (result == null) return NotFound();
        return Ok(result);
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<ActionResult> Create(RoadmapRequestDto request)
    {
        var created = await roadmapService.CreateRoadmapAsync(request);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }
    [Authorize(Roles = "Admin")]
    [HttpPut("{id}")]
    public async Task<ActionResult<RoadmapResponseDto>> Update(int id, RoadmapResponseDto request)
    {
        var updated = await roadmapService.UpdateRoadmapAsync(id, request);
        if (updated == null) return NotFound();
        return Ok(updated);
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("{id}/duplicate")]
    public async Task<ActionResult<RoadmapResponseDto>> Duplicate(int id)
    {
        var duplicated = await roadmapService.DuplicateRoadmapAsync(id);
        if (duplicated == null) return NotFound();
        return Ok(duplicated);
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await roadmapService.DeleteRoadmapAsync(id);
        if (!deleted) return NotFound(new { message = "Roadmap not found." });

        return NoContent();
    }
}