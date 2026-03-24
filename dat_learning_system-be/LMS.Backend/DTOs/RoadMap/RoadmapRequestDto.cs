namespace LMS.Backend.DTOs.RoadMap;

public class RoadmapRequestDto
{
    public string Title { get; set; } = null!;
    public string Description { get; set; } = null!;
    public string? TargetRole { get; set; }
    // We handle the file/thumbnail in the controller/service
}