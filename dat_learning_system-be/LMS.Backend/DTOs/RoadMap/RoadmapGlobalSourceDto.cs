namespace LMS.Backend.DTOs.RoadMap;

public class RoadmapGlobalSourceDto
{
    public string? Value { get; set; } // This will hold "EBook - 1" or "Course - GUID"
    public string Title { get; set; } = "N/A";
    public string? Description { get; set; }
    public string Type { get; set; } = null!; // "EBook" or "Course"
}