namespace LMS.Backend.DTOs.Library;

public class LibraryStatsDto
{
    public int TotalBooks { get; set; }
    public double TotalMinutesSpent { get; set; }
    public int BooksOpened { get; set; }
    public int BooksDownloaded { get; set; }
}