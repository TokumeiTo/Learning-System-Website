namespace LMS.Backend.DTOs.Library;

// The standard book data returned to the UI
public class EBookResponseDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Author { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string ThumbnailUrl { get; set; } = string.Empty;
    public string FileUrl { get; set; } = string.Empty;
    public string FileName { get; set; } = string.Empty;
    public bool IsActive { get; set; }


    // Read-only Analytics for the UI
    public int TotalDownloadCount { get; set; }
    public int TotalReaderCount { get; set; }
    public double AverageRating { get; set; }
    public DateTime CreatedAt { get; set; }
}

// Personal progress data (Specific to the logged-in student)
public class UserBookProgressDto
{
    public int EBookId { get; set; }
    public double TotalMinutesSpent { get; set; }
    public bool HasDownloaded { get; set; }
    public bool HasOpened { get; set; }
    public DateTime LastAccessedAt { get; set; }
}

public class PagedLibraryResponseDto
{
    // The actual slice of books for the current page
    public IEnumerable<EBookResponseDto> Items { get; set; } = [];

    // Total count of books in the database (filtered by category if applicable)
    // The Frontend uses this to calculate: Total Pages = TotalCount / PageSize
    public int TotalCount { get; set; }

    // Metadata to help the UI stay in sync
    public int CurrentPage { get; set; }
    public int PageSize { get; set; }

    // Helper property for the frontend
    public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);

    public bool HasNextPage => CurrentPage < TotalPages;
    public bool HasPreviousPage => CurrentPage > 1;
}