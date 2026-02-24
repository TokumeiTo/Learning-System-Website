namespace LMS.Backend.DTOs.Test_Quest;

public class TestDto
{
    public Guid Id { get; set; }
    public List<QuestionDto> Questions { get; set; } = new();
}

public class QuestionDto
{
    public Guid Id { get; set; }
    public string QuestionText { get; set; } = string.Empty;
    public int Points { get; set; } = 1;
    public int SortOrder { get; set; }
    public List<OptionDto> Options { get; set; } = new();
}

public class OptionDto
{
    public Guid Id { get; set; }
    public string OptionText { get; set; } = string.Empty;

    // Admin: Sets true/false
    // Student: Received as null (for security)
    public bool? IsCorrect { get; set; }
}

public class LessonSubmissionDto
{
    public Guid LessonId { get; set; }

    // A list of all Option IDs the student clicked across ALL test blocks in the lesson
    public List<Guid> SelectedOptionIds { get; set; } = new();
}

public class LessonResultDto
{
    public int Score { get; set; }           // Points earned
    public int MaxScore { get; set; }        // Total possible points
    public double Percentage { get; set; }    // (Score / MaxScore) * 100
    public bool IsPassed { get; set; }       // Based on Lesson.PassingScore
    public DateTime AttemptedAt { get; set; }
}