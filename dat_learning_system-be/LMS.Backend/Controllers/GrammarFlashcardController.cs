// Controllers/GrammarController.cs
using LMS.Backend.DTOs.Flashcard;
using LMS.Backend.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace LMS.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GrammarFlashcardController : ControllerBase
{
    private readonly IGrammarFlashcardService _service;

    public GrammarFlashcardController(IGrammarFlashcardService service)
    {
        _service = service;
    }

    [HttpGet("level/{level}")]
    public async Task<ActionResult<IEnumerable<GrammarDto>>> GetByLevel(string level)
    {
        var result = await _service.GetAllByLevelAsync(level);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<GrammarDto>> GetById(Guid id)
    {
        var result = await _service.GetByIdAsync(id);
        if (result == null) return NotFound();
        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<GrammarDto>> Create([FromBody] GrammarCreateUpdateDto dto)
    {
        // FluentValidation runs automatically here due to [ApiController]
        await _service.CreateGrammarAsync(dto);
        return Ok(new { message = "Grammar point created successfully" });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] GrammarCreateUpdateDto dto)
    {
        try 
        {
            await _service.UpdateGrammarAsync(id, dto);
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await _service.DeleteGrammarAsync(id);
        return NoContent();
    }
}