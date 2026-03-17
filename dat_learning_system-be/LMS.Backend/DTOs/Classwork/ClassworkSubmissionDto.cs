namespace LMS.Backend.DTOs.Classwork;

public class SubmitClassworkDto
{
    public Guid ClassworkItemId { get; set; }
    // Base64 file content
    public string Body { get; set; } = string.Empty;
    public string FileName { get; set; } = string.Empty;
}

public class ClassworkSubmissionDto
{
    public Guid Id { get; set; }
    public string FileUrl { get; set; } = string.Empty;
    public string FileName { get; set; } = string.Empty;
    public DateTime SubmittedAt { get; set; }
    public DateTime? UpdatedAt { get; set; } // If not null, UI shows "Edited on..."

    public double? Grade { get; set; }
    public string? Feedback { get; set; }
}

public class AdminSubmissionViewDto : ClassworkSubmissionDto
{
    public string StudentId { get; set; } = string.Empty;
    public string StudentName { get; set; } = string.Empty;
}