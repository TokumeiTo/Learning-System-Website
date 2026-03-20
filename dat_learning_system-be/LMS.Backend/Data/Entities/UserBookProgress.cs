namespace LMS.Backend.Data.Entities;

public class UserBookProgress
{
    public int Id { get; set; }
    public Guid UserId { get; set; }
    public int EBookId { get; set; }

    // Anti-Cheating Flags
    public bool HasDownloaded { get; set; } // Once true, TotalDownloadCount won't increment again
    public bool HasOpened { get; set; }     // Once true, TotalReaderCount won't increment again

    // The "Time Spent" Logic
    public double TotalMinutesSpent { get; set; } 
    public DateTime LastAccessedAt { get; set; } = DateTime.UtcNow;

    public virtual EBook EBook { get; set; } = null!;
}