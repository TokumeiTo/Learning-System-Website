namespace LMS.Backend.Data.Entities;

public class EBook
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; } = string.Empty;
    public string Author { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string ThumbnailUrl { get; set; } = string.Empty;
    public string FileUrl { get; set; } = string.Empty;
    public string FileName { get; set; } = string.Empty;
    
    // Analytics (Aggregated)
    public int TotalDownloadCount { get; set; } // Incremented only on first download
    public int TotalReaderCount { get; set; }   // Incremented only on first "Read" click
    public double AverageRating { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public bool IsActive { get; set; } = true;
}