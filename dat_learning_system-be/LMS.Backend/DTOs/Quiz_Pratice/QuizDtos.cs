using LMS.Backend.Common;

namespace LMS.Backend.DTOs.Test_Quest;

public class JlptTestDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? JlptLevel { get; set; } // N1, N2, etc.
    public string? Category { get; set; }  // Kanji, Grammar, etc.
    public int PassingGrade { get; set; }
    public int QuestionCount { get; set; } // Nice to show the user how long it is
}
public class QuizQuestionDto
{
    public Guid QuizItemId { get; set; }
    public QuizDisplayMode DisplayMode { get; set; }
    
    // For Kanji: "お「かね」を..." 
    // For Star: "この ＿ ＿ ★ ＿ です。"
    public string Prompt { get; set; } = string.Empty;

    // The 4 options (shuffled)
    public List<string> Options { get; set; } = new List<string>();

    // We don't send the "CorrectAnswer" to the frontend to prevent cheating!
    // We only send it back when the quiz is finished.
    
    public int Points { get; set; }
    public int SortOrder { get; set; }
}
public class StarPuzzleDetailDto
{
    // Original: "この 私 の あつい 本は です"
    // Scrambled: ["本は", "の", "あつい", "私"]
    public List<string> ScrambledParts { get; set; } = new();
    
    // Which index in the final correct array is the Star? (Usually index 2 for the 3rd slot)
    public int StarIndex { get; set; } 
}
public class QuizSubmissionDto
{
    public int SessionId { get; set; }
    public List<QuizAnswerDto> Answers { get; set; } = new();
}

public class QuizAnswerDto
{
    public Guid QuizItemId { get; set; }
    public string SelectedAnswer { get; set; } = string.Empty;
}