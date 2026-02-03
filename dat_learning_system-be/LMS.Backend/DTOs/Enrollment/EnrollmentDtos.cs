namespace LMS.Backend.DTOs.Enrollment;

public class EnrollmentRequestDto
{
    public Guid Id { get; set; }
    public string StudentName { get; set; } = null!;
    public string StudentEmail { get; set; } = null!;
    public Guid CourseId { get; set; }
    public string CourseTitle { get; set; } = null!;
    public string Status { get; set; } = null!;
    public DateTime RequestedAt { get; set; }
}

public class SubmitEnrollmentDto
{
    public Guid CourseId { get; set; }
}

public class EnrollmentStatusResponseDto
{
    public bool IsEnrolled { get; set; }
    public string Status { get; set; } = "None";
}