using LMS.Backend.Common;
using LMS.Backend.Data.Dbcontext;
using LMS.Backend.Data.Entities;
using LMS.Backend.Repo.Interface;
using Microsoft.EntityFrameworkCore;

namespace LMS.Backend.Repo.Implement;

public class JlptQuizRepository : IJlptQuizRepository
{
    private readonly AppDbContext _context;

    public JlptQuizRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Test?> GetTestWithItemsAsync(Guid testId)
    {
        return await _context.Tests
            .Include(t => t.QuizItems)
            .FirstOrDefaultAsync(t => t.Id == testId);
    }

    public async Task<object?> GetSourceEntityAsync(string sourceId, QuizDisplayMode mode)
    {
        // Based on the DisplayMode, we know which table to jump into
        return mode switch
        {
            QuizDisplayMode.KanjiReading => await _context.Kanjis
                .Include(k => k.Examples)
                .FirstOrDefaultAsync(k => k.Id.ToString() == sourceId),

            QuizDisplayMode.GrammarStar => await _context.Grammars
                .Include(g => g.Examples)
                .FirstOrDefaultAsync(g => g.Id.ToString() == sourceId),

            // Onomatopoeia uses int PK, others use Guid
            QuizDisplayMode.ContextFill => int.TryParse(sourceId, out var intId)
                ? await _context.Onomatopoeias.Include(o => o.Examples).FirstOrDefaultAsync(o => o.Id == intId)
                : null,

            _ => await _context.Vocabularies
                .Include(v => v.Examples)
                .FirstOrDefaultAsync(v => v.Id.ToString() == sourceId)
        };
    }

    public async Task SaveSessionResultsAsync(QuizSession session, List<QuizSessionAnswer> answers)
    {
        // Manual Sync Logic: Ensure the session exists before updating
        var existingSession = await _context.QuizSessions
            .Include(s => s.Answers)
            .FirstOrDefaultAsync(s => s.Id == session.Id);

        if (existingSession != null)
        {
            existingSession.FinalScore = session.FinalScore;
            existingSession.IsPassed = session.IsPassed;
            existingSession.FinishedAt = DateTime.UtcNow;

            // Add the batch of answers
            foreach (var answer in answers)
            {
                _context.QuizSessionAnswers.Add(answer);
            }

            await _context.SaveChangesAsync();
        }
    }

    public async Task<QuizSession> StartSessionAsync(QuizSession session)
    {
        // Ensure we aren't tracking an entity with the same ID already
        _context.QuizSessions.Add(session);
        await _context.SaveChangesAsync();
        return session;
    }

    public async Task<List<Test>> GetTestsByJlptAsync(string level, string category)
    {
        // Filter by JLPT level (N1-N5) and Category (Grammar, Kanji, etc.)
        // We only show Active tests that are NOT linked to a specific lesson (Global tests)
        return await _context.Tests
            .Where(t => t.JlptLevel == level
                     && t.Category == category
                     && t.IsActive
                     && t.LessonContentId == null)
            .OrderBy(t => t.Title)
            .ToListAsync();
    }

    public async Task<List<QuizSession>> GetUserHistoryAsync(string userId, string? category = null)
    {
        var query = _context.QuizSessions
            .Include(s => s.Test)
            .Where(s => s.UserId == userId);

        // If a category is provided (e.g., "Kanji"), filter the history by the Test's category
        if (!string.IsNullOrEmpty(category))
        {
            query = query.Where(s => s.Test.Category == category);
        }

        return await query
            .OrderByDescending(s => s.StartedAt)
            .ToListAsync();
    }

    public async Task<QuizSession?> GetSessionWithTestAsync(int sessionId)
    {
        return await _context.QuizSessions
            .Include(s => s.Test)
                .ThenInclude(t => t.QuizItems)
            .FirstOrDefaultAsync(s => s.Id == sessionId);
    }
}