using LMS.Backend.Data.Dbcontext;
using LMS.Backend.Data.Entities;
using LMS.Backend.Repo.Interface;
using Microsoft.EntityFrameworkCore;

namespace LMS.Backend.Repo.Implement;

public class TestRepository : ITestRepository
{
    private readonly AppDbContext _context;

    public TestRepository(AppDbContext context)
    {
        _context = context;
    }
    public async Task<Test?> GetTestByIdWithAnswersAsync(Guid testId)
    {
        return await _context.Tests
            .IgnoreQueryFilters()
            .Include(t => t.Questions)
                .ThenInclude(q => q.Options)
            .AsSplitQuery() // Tells Npgsql to send separate SELECT commands
            .AsNoTracking()
            .FirstOrDefaultAsync(t => t.Id == testId);
    }
    public async Task<IEnumerable<Test>> GetGlobalQuizzesAsync(string? level, string? category)
    {
        var query = _context.Tests
            .Include(t => t.Questions)
            .Where(t => t.LessonContentId == null && t.IsActive);

        if (!string.IsNullOrEmpty(level))
            query = query.Where(t => t.JlptLevel == level);

        if (!string.IsNullOrEmpty(category))
            query = query.Where(t => t.Category == category);

        return await query.ToListAsync();
    }
    public async Task<Test> UpsertTestAsync(Guid lessonContentId, Test incomingTest)
    {
        // 1. Clear tracker at the start to avoid identity conflicts with previous scoped operations
        _context.ChangeTracker.Clear();

        Test? existingActiveTest = null;
        bool isGlobal = lessonContentId == Guid.Empty;

        var query = _context.Tests
            .IgnoreQueryFilters()
            .Include(t => t.Questions)
                .ThenInclude(q => q.Options);

        if (!isGlobal)
        {
            existingActiveTest = await query.FirstOrDefaultAsync(t => t.LessonContentId == lessonContentId && t.IsActive);
        }
        else
        {
            existingActiveTest = await query.FirstOrDefaultAsync(t => t.Title == incomingTest.Title && t.IsGlobal && t.IsActive);
        }

        bool hasAttempts = existingActiveTest != null && await _context.TestAttempts.AnyAsync(a => a.TestId == existingActiveTest.Id);

        if (existingActiveTest == null || hasAttempts)
        {
            if (existingActiveTest != null)
            {
                // Update the existing record to inactive
                existingActiveTest.IsActive = false;
                _context.Tests.Update(existingActiveTest); // Explicitly track for update

                incomingTest.Version = existingActiveTest.Version + 1;
            }
            else if (isGlobal)
            {
                var maxVersion = await _context.Tests
                    .IgnoreQueryFilters()
                    .Where(t => t.Title == incomingTest.Title && t.IsGlobal)
                    .MaxAsync(t => (int?)t.Version) ?? 0;

                incomingTest.Version = maxVersion + 1;
            }

            // 2. IMPORTANT: Generate brand new IDs for the entire tree
            // This prevents the "Instance already tracked" error 100%
            incomingTest.Id = Guid.NewGuid();
            incomingTest.LessonContentId = isGlobal ? (Guid?)null : lessonContentId;
            incomingTest.IsGlobal = isGlobal;
            incomingTest.IsActive = true;

            foreach (var q in incomingTest.Questions)
            {
                q.Id = Guid.NewGuid();
                q.TestId = incomingTest.Id;
                foreach (var opt in q.Options)
                {
                    opt.Id = Guid.NewGuid();
                    opt.QuestionId = q.Id;
                }
            }

            await _context.Tests.AddAsync(incomingTest);
        }
        else
        {
            // MANUAL SYNC: Update existing record
            existingActiveTest.Title = incomingTest.Title;
            existingActiveTest.PassingGrade = incomingTest.PassingGrade;
            existingActiveTest.JlptLevel = incomingTest.JlptLevel;
            existingActiveTest.Category = incomingTest.Category;
            existingActiveTest.IsGlobal = incomingTest.IsGlobal;

            SyncQuestionsAndOptions(existingActiveTest, incomingTest.Questions.ToList());
        }

        await _context.SaveChangesAsync();
        return existingActiveTest ?? incomingTest;
    }

    public async Task<int> GetTotalPointsForLessonAsync(Guid lessonId)
    {
        return await _context.Questions
            .Where(q => q.Test!.LessonContent!.LessonId == lessonId)
            .SumAsync(q => q.Points);
    }

    public async Task<TestAttempt> UpsertAttemptAsync(TestAttempt newAttempt)
    {
        // Check for existing attempt by this user for this specific test
        var existing = await _context.TestAttempts
                            .FirstOrDefaultAsync(a => a.UserId == newAttempt.UserId &&
                                                        a.TestId == newAttempt.TestId &&
                                                        a.LessonId == newAttempt.LessonId);

        if (existing == null)
        {
            // First time taking the test
            newAttempt.Attempts = 1;
            newAttempt.AttemptedAt = DateTime.UtcNow;
            await _context.TestAttempts.AddAsync(newAttempt);
            await _context.SaveChangesAsync();
            return newAttempt;
        }

        existing.Attempts += 1;
        existing.AttemptedAt = DateTime.UtcNow;
        if (newAttempt.IsPassed)
        {
            existing.IsPassed = true;
        }

        // Always update the latest score and answers
        existing.Score = newAttempt.Score;
        existing.MaxScore = newAttempt.MaxScore;
        existing.Percentage = newAttempt.Percentage;
        existing.AnswerJson = newAttempt.AnswerJson;

        await _context.SaveChangesAsync();
        return existing;
    }

    public async Task<object> GetCategoryProgressAsync(string userId, string level)
    {
        // 1. Get all active global tests for this level
        var totalTests = await _context.Tests
            .Where(t => t.IsGlobal && t.IsActive && t.JlptLevel == level)
            .ToListAsync();

        // 2. Get the unique IDs of tests this user has passed
        var passedTestIds = await _context.TestAttempts
            .Where(a => a.UserId == userId && a.IsPassed)
            .Select(a => a.TestId)
            .Distinct()
            .ToListAsync();

        // 3. Group by Category to get the "32%" or "100%" values
        return totalTests
            .GroupBy(t => t.Category)
            .Select(g => new
            {
                Category = g.Key,
                TotalCount = g.Count(),
                PassedCount = g.Count(t => passedTestIds.Contains(t.Id)),
                ProgressPercentage = g.Count() > 0
                    ? (int)Math.Round((double)g.Count(t => passedTestIds.Contains(t.Id)) / g.Count() * 100)
                    : 0
            });
    }

    // Helpers
    private void ProcessNewTestTree(Test test)
    {
        // Convert to list locally so we can use [i] and .Count
        var questionsList = test.Questions.ToList();

        for (int i = 0; i < questionsList.Count; i++)
        {
            var q = questionsList[i];

            if (q.Id == Guid.Empty) q.Id = Guid.NewGuid();
            q.SortOrder = i + 1;

            foreach (var opt in q.Options)
            {
                if (opt.Id == Guid.Empty) opt.Id = Guid.NewGuid();
            }
        }
    }

    public async Task<List<Guid>> GetCorrectOptionIdsForLessonAsync(Guid lessonId)
    {
        return await _context.QuestionOptions
            .Where(o => o.IsCorrect &&
                    o.Question!.Test!.IsActive &&
                    o.Question!.Test!.LessonContent!.LessonId == lessonId)
            .Select(o => o.Id)
            .ToListAsync();
    }

    // Helpers
    private void SyncQuestionsAndOptions(Test existingTest, List<Question> incomingQs)
    {
        var incomingQIds = incomingQs.Select(q => q.Id).Where(id => id != Guid.Empty).ToList();

        // 1. Remove questions no longer in the request
        var questionsToRemove = existingTest.Questions
            .Where(q => !incomingQIds.Contains(q.Id))
            .ToList();

        foreach (var qRem in questionsToRemove)
        {
            _context.Questions.Remove(qRem);
        }

        // 2. Sync or Add Questions
        for (int i = 0; i < incomingQs.Count; i++)
        {
            var inQ = incomingQs[i];
            var exQ = (inQ.Id == Guid.Empty)
                ? null
                : existingTest.Questions.FirstOrDefault(q => q.Id == inQ.Id);

            if (exQ == null)
            {
                // NEW QUESTION
                inQ.Id = Guid.NewGuid();
                inQ.TestId = existingTest.Id;
                inQ.SortOrder = i + 1;

                // Ensure child options have IDs
                foreach (var opt in inQ.Options) { opt.Id = Guid.NewGuid(); }

                existingTest.Questions.Add(inQ);
            }
            else
            {
                // UPDATE EXISTING QUESTION
                exQ.QuestionText = inQ.QuestionText;
                exQ.Points = inQ.Points;
                exQ.SortOrder = i + 1;
                exQ.Type = inQ.Type;
                exQ.MediaUrl = inQ.MediaUrl;

                // Deep Sync child Options
                SyncOptions(exQ, inQ.Options.ToList());
            }
        }
    }

    private void SyncOptions(Question existingQ, List<QuestionOption> incomingOpts)
    {
        var incomingOptIds = incomingOpts.Select(o => o.Id).Where(id => id != Guid.Empty).ToList();

        // 1. Remove options no longer in the request
        var optionsToRemove = existingQ.Options
            .Where(o => !incomingOptIds.Contains(o.Id))
            .ToList();

        foreach (var oRem in optionsToRemove)
        {
            _context.QuestionOptions.Remove(oRem);
        }

        // 2. Sync or Add Options
        foreach (var inOpt in incomingOpts)
        {
            var exOpt = (inOpt.Id == Guid.Empty)
                ? null
                : existingQ.Options.FirstOrDefault(o => o.Id == inOpt.Id);

            if (exOpt == null)
            {
                // NEW OPTION
                inOpt.Id = Guid.NewGuid();
                inOpt.QuestionId = existingQ.Id;
                existingQ.Options.Add(inOpt);
            }
            else
            {
                // UPDATE EXISTING OPTION
                exOpt.OptionText = inOpt.OptionText;
                exOpt.IsCorrect = inOpt.IsCorrect;
                exOpt.MediaUrl = inOpt.MediaUrl;
            }
        }
    }

    public async Task<List<TestAttempt>> GetAttemptsByLevelAsync(string userId, string level)
    {
        return await _context.TestAttempts
            .Include(a => a.Test)
            .Where(a => a.UserId == userId && a.Test.JlptLevel == level)
            .ToListAsync();
    }

    public async Task<Test?> GetActiveTestByTitleAsync(string title, bool isGlobal)
    {
        return await _context.Tests
            .IgnoreQueryFilters()
            .FirstOrDefaultAsync(t => t.Title == title && t.IsGlobal == isGlobal && t.IsActive);
    }

    public async Task<List<Test>> GetTestVersionsAsync(string title, bool isGlobal)
    {
        return await _context.Tests
            .IgnoreQueryFilters()
            .Where(t => t.Title == title && t.IsGlobal == isGlobal)
            .OrderByDescending(t => t.Version)
            .ToListAsync();
    }
    public async Task<bool> HasAttemptsAsync(Guid testId)
    {
        return await _context.TestAttempts.AnyAsync(a => a.TestId == testId);
    }
}