namespace LMS.Backend.Data.Entities;

public class Assignment {
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty; // Teacher's instructions
    public Guid TopicId { get; set; }
    public Topic Topic { get; set; } = null!;

    // Links to all student turn-ins
    public ICollection<Submission> Submissions { get; set; } = new List<Submission>();
}