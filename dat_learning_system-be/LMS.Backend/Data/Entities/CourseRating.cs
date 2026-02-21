namespace LMS.Backend.Data.Entities;

public class CourseRating
{
    public Guid Id { get; set; }
    
    // Relationship to Course
    public Guid CourseId { get; set; }
    public Course Course { get; set; } = null!;

    // Relationship to User
    public string UserId { get; set; } = string.Empty;
    public ApplicationUser User { get; set; } = null!;

    public int Score { get; set; } // 1-5 stars
    public string? Comment { get; set; } // Optional review text
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}