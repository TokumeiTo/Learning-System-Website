using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LMS.Backend.Data.Entities;

public class Enrollment
{
    [Key]
    public Guid Id { get; set; }

    // Link to Student
    public string UserId { get; set; } = null!;
    [ForeignKey("UserId")]
    public virtual ApplicationUser User { get; set; } = null!;

    // Link to Course
    public Guid CourseId { get; set; }
    [ForeignKey("CourseId")]
    public virtual Course Course { get; set; } = null!;

    // Status logic for the "Approve/Reject" flow
    // Default is "Pending" when a user clicks Enroll
    public string Status { get; set; } = "Pending"; 

    public DateTime RequestedAt { get; set; } = DateTime.UtcNow;
    public DateTime? ApprovedAt { get; set; }
    
    // Optional: Tracking progress for this specific user
    public double ProgressPercentage { get; set; } = 0;
    public bool IsCompleted { get; set; } = false;
}