namespace LMS.Backend.Data.Entities;

public class Question
{
    public Guid Id { get; set; }
    public Guid TestId { get; set; }
    public Test Test { get; set; } = null!;

    public string QuestionText { get; set; } = string.Empty;
    public int SortOrder { get; set; }
    
    // Each question has its own point value
    public int Points { get; set; } = 1;

    public ICollection<QuestionOption> Options { get; set; } = new List<QuestionOption>();
}

public class QuestionOption
{
    public Guid Id { get; set; }
    public Guid QuestionId { get; set; }
    public Question Question { get; set; } = null!;

    public string OptionText { get; set; } = string.Empty;
    public bool IsCorrect { get; set; }
}