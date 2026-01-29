namespace LMS.Backend.Data.Entities;

public class Submission {
    public Guid Id { get; set; }
    public string ContentText { get; set; } = string.Empty; // Student's message/homework text
    public string? FileUrl { get; set; }                   // Path to uploaded image/file
    public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;

    public string StudentId { get; set; } = string.Empty;
    public ApplicationUser Student { get; set; } = null!;

    public Guid AssignmentId { get; set; }
    public Assignment Assignment { get; set; } = null!;
}