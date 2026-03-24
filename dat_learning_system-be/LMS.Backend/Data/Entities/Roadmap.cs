namespace LMS.Backend.Data.Entities;

public class RoadMap
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? TargetRole { get; set; } 
    public string? ThumbnailUrl { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<RoadmapStep> Nodes { get; set; } = new List<RoadmapStep>();
}

public class RoadmapStep
{
    public int Id { get; set; }
    public int LearningPathId { get; set; }
    public RoadMap RoadMap { get; set; } = null!;

    public string Title { get; set; } = string.Empty;
    public string NodeType { get; set; } = "Instruction"; // EBook, Course, Instruction
    
    // This is the "What to do" or "How to do it"
    public string? Content { get; set; } 
    
    // If NodeType is EBook, store the ID here to link to your existing Library
    public int? LinkedResourceId { get; set; } 

    public int SortOrder { get; set; }
}