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
}