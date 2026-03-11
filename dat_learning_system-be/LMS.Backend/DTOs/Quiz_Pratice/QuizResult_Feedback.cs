namespace LMS.Backend.DTOs.Test_Quest;
public class QuizResultDto
{
    public int Score { get; set; }
    public int TotalPoints { get; set; }
    public bool IsPassed { get; set; }
    public List<AnswerFeedbackDto> Feedback { get; set; } = new();
}

public class AnswerFeedbackDto
{
    public Guid QuizItemId { get; set; }
    public bool IsCorrect { get; set; }
    public string CorrectAnswer { get; set; } = string.Empty;
    public string? Explanation { get; set; } // Pulled from Grammar/Kanji tables
}