namespace LMS.Backend.DTOs.RoadMap;

public class RoadmapResponseDto
{
    public int Id { get; set; }
    public string Title { get; set; } = null!;
    public string Description { get; set; } = null!;
    public string? TargetRole { get; set; }
    public string? ThumbnailUrl { get; set; }
    public int StepCount { get; set; }
    public List<RoadmapStepDto> Steps { get; set; } = new();
}

public class RoadmapStepDto
{
    public int Id { get; set; }
    public string Title { get; set; } = null!;
    public string NodeType { get; set; } = null!; // EBook, Course, Instruction
    public string? Content { get; set; }
    public string? LinkedResourceId { get; set; }
    public string? LinkedResourceTitle { get; set; }
    public string? LinkedResourceDescription { get; set; }
    public int SortOrder { get; set; }
}
