namespace LMS.Backend.DTOs.Test_Quest;

public class TestDto
{
    public Guid Id { get; set; }
    public string? title { get; set; }
    public List<QuestionDto> Questions { get; set; } = new();
    public int PassingGrade { get; set; }
    public bool IsActive { get; set; } = true;
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
    public Guid TestId { get; set; }
    // Key: QuestionId, Value: OptionId
    public Dictionary<Guid, Guid> Answers { get; set; } = new();
}

public class LessonResultDto
{
    public int Score { get; set; }           // Points earned
    public int MaxScore { get; set; }        // Total possible points
    public decimal Percentage { get; set; }    // (Score / MaxScore) * 100
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

public class AdminQuestionDto
{
    public int DisplayMode { get; set; }
    public string Prompt { get; set; } = string.Empty;
    public string CorrectAnswer { get; set; } = string.Empty;
    public string Explanation { get; set; } = string.Empty;
    public int Points { get; set; }
    public List<string> Options { get; set; } = new();
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

public class LinkQuestionDto
{
    public Guid TestId { get; set; }
    // The Guid of the Kanji, Vocabulary, or Grammar record from your existing tables
    public string SourceId { get; set; } = string.Empty;

    // Mapping to your QuizDisplayMode Enum (0: KanjiReading, 2: GrammarStar, etc.)
    public int DisplayMode { get; set; }

    public int Points { get; set; } = 10;

    // Optional: Used specifically for Grammar Star to store the sentence structure 
    // or for a Custom Prompt that overrides the default Flashcard display.
    public string? CustomPrompt { get; set; }
}

public class GlobalSearchResultDto
{
    public string Id { get; set; } = string.Empty;
    public string DisplayText { get; set; } = string.Empty; // e.g., "私 (I, me)"
    public string Type { get; set; } = string.Empty; // "Kanji", "Vocabulary", or "Grammar"
    public string JlptLevel { get; set; } = string.Empty;
}