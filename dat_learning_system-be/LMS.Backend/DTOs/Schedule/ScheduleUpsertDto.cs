using LMS.Backend.Common;

namespace LMS.Backend.DTOs.Schedule;

public class SchedulePlanDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = null!;
    public string? Description { get; set; }
    public string? CourseName { get; set; }
    public string? InstructorName { get; set; }
    public string ActivityType { get; set; } = null!;
    public DateTime StartTime { get; set; }
    public DateTime? EndTime { get; set; }
    public string Location { get; set; } = null!;
    public string Color { get; set; } = null!;
    public bool IsPublic { get; set; }

    // Backend converts string to List for the UI
    public List<Position> TargetPositions { get; set; } = new();
    public List<string> TargetUserCodes { get; set; } = new();
    
    public string CreatedBy { get; set; } = null!;
    public DateTime CreatedAt { get; set; }
}
public class SchedulePlanUpsertDto
{
    public string Title { get; set; } = null!;
    public string? Description { get; set; }
    public string? CourseName { get; set; }
    public string? InstructorName { get; set; }
    public string ActivityType { get; set; } = "LECTURE";
    public DateTime StartTime { get; set; }
    public DateTime? EndTime { get; set; }
    public string Location { get; set; } = "Online";
    public string Color { get; set; } = "#6366f1";
    public bool IsPublic { get; set; }
    
    // UI sends these as arrays
    public List<Position>? TargetPositions { get; set; }
    public List<string>? TargetUserCodes { get; set; }
}

