using LMS.Backend.Common;

namespace LMS.Backend.Data.Entities;
public class QuizTemplate
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public JLPTLevel Level { get; set; }
    public QuizSourceType SourceType { get; set; }
    
    public int QuestionCount { get; set; } = 10;
    public int TimeLimitSeconds { get; set; } = 300; // 5 mins default
    public int PassScorePercentage { get; set; } = 70;

    // Navigation
    public virtual ICollection<QuizSession> Sessions { get; set; } = new List<QuizSession>();
}