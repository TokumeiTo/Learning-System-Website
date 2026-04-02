using System.Security.Claims;
using LMS.Backend.DTOs.Lesson;
using LMS.Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LMS.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize] // Must be logged in to track progress
public class LocalFileManagementController : ControllerBase
{
    private readonly IFileService _service;

    public LocalFileManagementController(IFileService service)
    {
        _service = service;
    }
    [HttpGet("download")]
    public async Task<IActionResult> DownloadFile([FromQuery] string fileUrl)
    {
        try
        {
            var (stream, contentType, fileName) = await _service.GetFileStreamForDownloadAsync(fileUrl);

            // ASP.NET Core handles closing the stream automatically when the download finishes
            return File(stream, contentType, fileName);
        }
        catch (FileNotFoundException)
        {
            return NotFound();
        }
    }

    [HttpPost("file")]
    public async Task<IActionResult> UploadMedia([FromForm] IFormFile file, [FromForm] string folderName)
    {
        try
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");

            // This calls your LocalFileService logic we reviewed earlier
            // It handles the (1), (2), (3) naming and directory creation
            string fileUrl = await _service.UploadFileAsync(file, folderName);

            if (string.IsNullOrEmpty(fileUrl))
                return StatusCode(500, "File upload failed.");

            // Return the plain string URL (e.g., "/uploads/audio/vocab_n3.mp3")
            return Ok(fileUrl);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    [HttpDelete("remove")]
    public IActionResult DeleteMedia([FromQuery] string fileUrl)
    {
        _service.DeleteFile(fileUrl);
        return Ok(new { message = "File deleted successfully" });
    }
}