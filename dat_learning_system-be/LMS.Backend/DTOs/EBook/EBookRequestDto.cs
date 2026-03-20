namespace LMS.Backend.DTOs.Library;

// Used for both Creating and Updating a book
public class EBookRequestDto
{
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; } = string.Empty;
    public string Author { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string FileName { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;

    public IFormFile? EBookFile { get; set; }
    public IFormFile? ThumbnailFile { get; set; }

    public string FileUrl { get; set; } = string.Empty;
    public string ThumbnailUrl { get; set; } = string.Empty;
}

// Used for the Heartbeat / Progress update
public class BookActivityRequestDto
{
    public int EBookId { get; set; }
    public double MinutesToAdd { get; set; } = 0.25; // Default 15 seconds
    public bool? IsDownloading { get; set; }
    public bool? IsOpening { get; set; }
}