namespace LMS.Backend.Data.Entities;

public class Topic {
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty; // e.g., "Japanese Basics"
    public Guid CourseId { get; set; }
    public Course Course { get; set; } = null!;
    
    public ICollection<Assignment> Assignments { get; set; } = new List<Assignment>();
}