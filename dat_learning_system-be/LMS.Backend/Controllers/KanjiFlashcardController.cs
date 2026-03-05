using Microsoft.AspNetCore.Mvc;
using LMS.Backend.DTOs.Flashcard;
using LMS.Backend.Services.Interfaces;

namespace LMS.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class KanjisController : ControllerBase
{
    private readonly IKanjiFlashcardService _kanjiService;

    public KanjisController(IKanjiFlashcardService kanjiService)
    {
        _kanjiService = kanjiService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<KanjiDto>>> GetAll([FromQuery] string? level)
    {
        var result = await _kanjiService.GetAllKanjisAsync(level);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<KanjiDto>> GetById(Guid id)
    {
        var result = await _kanjiService.GetKanjiByIdAsync(id);
        if (result == null) return NotFound(new { message = "Kanji not found" });
        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<KanjiDto>> Create(KanjiCreateUpdateDto dto)
    {
        var result = await _kanjiService.CreateKanjiAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, KanjiCreateUpdateDto dto)
    {
        var success = await _kanjiService.UpdateKanjiAsync(id, dto);
        if (!success) return NotFound();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var success = await _kanjiService.DeleteKanjiAsync(id);
        if (!success) return NotFound();
        return NoContent();
    }
}