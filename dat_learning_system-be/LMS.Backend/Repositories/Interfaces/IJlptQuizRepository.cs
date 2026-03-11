using LMS.Backend.Common;
using LMS.Backend.Data.Entities;

namespace LMS.Backend.Repo.Interface;

public interface IJlptQuizRepository
{
    // Retrieval
    Task<Test?> GetTestWithItemsAsync(Guid testId);
    Task<List<Test>> GetTestsByJlptAsync(string level, string category);
    Task<QuizSession?> GetSessionWithTestAsync(int sessionId);
    
    // The "Universal" Source Linker
    Task<object?> GetSourceEntityAsync(string sourceId, QuizDisplayMode mode);

    // Session & Results (Manual Sync Logic)
    Task<QuizSession> StartSessionAsync(QuizSession session);
    Task SaveSessionResultsAsync(QuizSession session, List<QuizSessionAnswer> answers);
    
    // Performance Review
    Task<List<QuizSession>> GetUserHistoryAsync(string userId, string? category = null);
}