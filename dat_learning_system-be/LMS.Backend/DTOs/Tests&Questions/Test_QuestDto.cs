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
    // Key: QuestionId, Value: OptionId
    public Dictionary<Guid, Guid> Answers { get; set; } = new();
}

public class LessonResultDto
{
    public int Score { get; set; }           // Points earned
    public int MaxScore { get; set; }        // Total possible points
    public double Percentage { get; set; }    // (Score / MaxScore) * 100
    public bool IsPassed { get; set; }       // Based on Lesson.PassingScore
    public DateTime AttemptedAt { get; set; }
}


public class AdminLessonStatsDto
{
    public Guid LessonId { get; set; }
    public string LessonTitle { get; set; } = string.Empty;
    public int TotalAttempts { get; set; }
    public int PassCount { get; set; }
    public double AveragePercentage { get; set; }
    public double SuccessRate => TotalAttempts > 0 ? (double)PassCount / TotalAttempts * 100 : 0;

    // Identifies if a specific quiz is "Too Hard"
    public List<QuestionAnalyticDto> DifficultQuestions { get; set; } = new();
}

public class QuestionAnalyticDto
{
    public Guid QuestionId { get; set; }
    public string QuestionText { get; set; } = string.Empty;
    public double FailureRate { get; set; } // Percentage of students who got this wrong
}

// For the "User KPI" Dashboard
public class StudentPerformanceDto
{
    public string UserId { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public int LessonsCompleted { get; set; }
    public double OverallAverageScore { get; set; }
    public DateTime? LastActivity { get; set; }
}

public class LessonAttemptDto
{
    public Guid Id { get; set; }
    public string UserId { get; set; } = string.Empty;
    public Guid LessonId { get; set; }
    
    public int Score { get; set; }
    public int MaxScore { get; set; }
    public double Percentage { get; set; }
    public bool IsPassed { get; set; }
    
    public DateTime AttemptedAt { get; set; }
    
    // Optional: Useful for KPIs to see if students are rushing or taking their time
    public int? TimeTakenSeconds { get; set; } 
}