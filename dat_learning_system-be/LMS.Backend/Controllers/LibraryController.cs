using LMS.Backend.DTOs.Library;
using LMS.Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace LMS.Backend.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class LibraryController(ILibraryService libraryService) : ControllerBase
{
    #region Student Endpoints

    [HttpGet]
    public async Task<ActionResult<PagedLibraryResponseDto>> GetAll(
        [FromQuery] string? category,
        [FromQuery] string? search,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 12) // Match to React hook
    {
        if (page < 1) page = 1;
        if (pageSize > 100) pageSize = 100;

        var userId = GetUserId();
        var result = await libraryService.GetPagedBooksAsync(userId, category, search, page, pageSize);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<EBookResponseDto>> GetById(int id)
    {
        var userId = GetUserId();
        var book = await libraryService.GetBookByIdAsync(id);

        if (book == null) return NotFound($"Book with ID {id} not found.");

        var progress = await libraryService.GetUserProgressAsync(userId, id);
        book.UserProgress = progress;

        return Ok(book);
    }

    [HttpGet("{id}/my-progress")]
    public async Task<ActionResult<UserBookProgressDto>> GetMyProgress(int id)
    {
        var userId = GetUserId(); // Now returns string
        var progress = await libraryService.GetUserProgressAsync(userId, id);

        if (progress == null) return NotFound("No progress found for this book.");
        return Ok(progress);
    }

    [HttpPost("activity")]
    public async Task<IActionResult> RecordActivity([FromBody] BookActivityRequestDto activity)
    {
        var userId = GetUserId();
        await libraryService.RecordActivityAsync(userId, activity);
        return NoContent();
    }

    [HttpGet("stats")]
    public async Task<ActionResult<LibraryStatsDto>> GetLibraryStats()
    {
        var userId = GetUserId();
        var stats = await libraryService.GetUserStatsAsync(userId);
        return Ok(stats);
    }

    [AllowAnonymous]
    [HttpGet("download/{id}")]
    public async Task<IActionResult> Download(int id)
    {
        var downloadData = await libraryService.PrepareDownloadAsync(id);

        if (downloadData == null)
        {
            return NotFound("The requested book is unavailable.");
        }

        return PhysicalFile(
            downloadData.FilePath,
            downloadData.ContentType,
            downloadData.FileName,
            enableRangeProcessing: true
        );
    }

    #endregion

    #region Admin Endpoints (CRUD)

    [Authorize(Roles = "SuperAdmin,Admin")]
    [HttpPost]
    [RequestSizeLimit(420_000_000)]
    public async Task<ActionResult<EBookResponseDto>> Create([FromForm] EBookRequestDto request)
    {
        var createdBook = await libraryService.CreateBookAsync(request);
        return Ok(new { message = "Resource created successfully!", data = createdBook });
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id}")]
    [RequestSizeLimit(420_000_000)]
    public async Task<IActionResult> Update(int id, [FromForm] EBookRequestDto request)
    {
        var success = await libraryService.UpdateBookAsync(id, request);
        if (!success) return NotFound(new { message = $"Update failed. Book {id} not found." });

        return Ok(new { message = "Resource updated successfully!" });
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var success = await libraryService.DeleteBookAsync(id);
        if (!success) return NotFound(new { message = "Delete failed. Resource not found." });

        return Ok(new { message = "Resource moved to trash successfully." });
    }

    #endregion

    #region Helpers

    private string GetUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(userIdClaim))
            throw new UnauthorizedAccessException("User ID claim is missing.");

        return userIdClaim;
    }

    #endregion
}