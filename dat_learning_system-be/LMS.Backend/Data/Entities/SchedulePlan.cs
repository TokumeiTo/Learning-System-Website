namespace LMS.Backend.Data.Entities;

public class SchedulePlan
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? CourseName { get; set; }

    public string? InstructorName { get; set; }
    public string ActivityType { get; set; } = "LECTURE"; // LECTURE, LAB, EXAM, MEETING, HOLIDAY
    public DateTime StartTime { get; set; }
    public DateTime? EndTime { get; set; }
    public string Location { get; set; } = "Online";
    public string Color { get; set; } = "#6366f1";

    // --- VISIBILITY & TARGETING ---
    
    // If true, ignores TargetPositions/Users and shows for everyone (e.g., Thingyan Festival)
    public bool IsPublic { get; set; } = false;

    // Comma-separated enums: "Employee,ProjectManager"
    public string? TargetPositions { get; set; } 

    // Comma-separated CompanyCodes: "EMP001,EMP042"
    public string? TargetUserCodes { get; set; } 

    public string CreatedBy { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}