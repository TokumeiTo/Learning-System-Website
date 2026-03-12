namespace LMS.Backend.DTOs.Test_Quest;
public class QuizResultDto
{
    public int Score { get; set; }
    public int TotalPoints { get; set; }
    public List<ResultDetailDto> Details { get; set; } = new();
}

public class ResultDetailDto
{
    public string QuestionPrompt { get; set; }
    public string UserAnswer { get; set; }
    public string CorrectAnswer { get; set; }
    public bool IsCorrect { get; set; }
}