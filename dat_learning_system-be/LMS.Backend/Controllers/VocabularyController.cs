using LMS.Backend.DTOs.Flashcard;
using LMS.Backend.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace LMS.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class VocabularyController : ControllerBase
{
    private readonly IVocabularyService _service;

    public VocabularyController(IVocabularyService service)
    {
        _service = service;
    }

    // GET: api/vocabulary/level/N5
    [HttpGet("level/{level}")]
    public async Task<ActionResult<IEnumerable<VocabResponseDto>>> GetByLevel(string level)
    {
        var result = await _service.GetLevelListAsync(level);
        return Ok(result);
    }

    // GET: api/vocabulary/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<VocabResponseDto>> GetById(Guid id)
    {
        var result = await _service.GetDetailAsync(id);
        if (result == null) return NotFound();
        
        return Ok(result);
    }

    // POST: api/vocabulary/upsert
    [HttpPost("upsert")]
    public async Task<ActionResult<VocabResponseDto>> Upsert(VocabUpsertRequestDto dto)
    {
        try 
        {
            var result = await _service.UpsertAsync(dto);
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
    }

    // DELETE: api/vocabulary/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var success = await _service.DeleteAsync(id);
        if (!success) return NotFound();

        return NoContent();
    }
}