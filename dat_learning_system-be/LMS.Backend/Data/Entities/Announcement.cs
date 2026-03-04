using LMS.Backend.Common;

namespace LMS.Backend.Data.Entities;

public class Announcement
{
    public Guid Id { get; set; }
    public string Title { get; set; } = null!;
    public string Content { get; set; } = null!;
    
    // Logic: If null, everyone sees it. 
    // If set, only users with this Position see it.
    public Position? TargetPosition { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    // The authority user sets how long this stays visible
    public DateTime DisplayUntil { get; set; }
    
    // Foreign Key to the Admin who created it
    public string CreatedByUserId { get; set; } = null!;
    public virtual ApplicationUser CreatedByUser { get; set; } = null!;
}