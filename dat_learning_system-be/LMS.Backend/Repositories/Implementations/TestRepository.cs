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
            .Include(t => t.Questions)
                .ThenInclude(q => q.Options)
            // Ensure you are matching the LESSON ID stored on the LessonContent
            .FirstOrDefaultAsync(t => t.Id == testId);
    }
    public async Task<Test?> GetActiveTestByContentIdAsync(Guid contentId)
    {
        return await _context.Tests
            .Include(t => t.Questions)
                .ThenInclude(q => q.Options)
            .AsNoTracking()
            .FirstOrDefaultAsync(t => t.LessonContentId == contentId && t.IsActive);
    }
    public async Task<Test> UpsertTestAsync(Guid lessonContentId, Test incomingTest)
    {
        // 1. Load the existing test with the full tracking tree
        var existingTest = await _context.Tests
            .Include(t => t.Questions)
                .ThenInclude(q => q.Options)
            .FirstOrDefaultAsync(t => t.LessonContentId == lessonContentId && t.IsActive);

        // Check existing attempts
        bool hasAttempts = existingTest != null && await _context.LessonAttempts.AnyAsync(a => a.TestId == existingTest.Id);

        if (existingTest == null || hasAttempts)
        {
            if (existingTest != null) existingTest.IsActive = false; // if Test is already existed, create new one and delete old one

            incomingTest.Id = Guid.NewGuid();
            incomingTest.LessonContentId = lessonContentId;
            incomingTest.IsActive = true;
            ProcessNewTestTree(incomingTest);

            await _context.Tests.AddAsync(incomingTest);
        }
        else
        {
            // MANUAL SYNC: Safe to update existing record
            existingTest.Title = incomingTest.Title;
            existingTest.PassingGrade = incomingTest.PassingGrade;

            // Sync Questions & Options
            SyncQuestionsAndOptions(existingTest, incomingTest.Questions.ToList());
        }

        await _context.SaveChangesAsync();
        return existingTest ?? incomingTest;
    }

    public async Task<int> GetTotalPointsForLessonAsync(Guid lessonId)
    {
        return await _context.Questions
            .Where(q => q.Test.IsActive && q.Test.LessonContent.LessonId == lessonId)
            .SumAsync(q => q.Points);
    }

    public async Task<LessonAttempt> CreateAttemptAsync(LessonAttempt attempt)
    {
        await _context.LessonAttempts.AddAsync(attempt);
        await _context.SaveChangesAsync();
        return attempt;
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
            q.SortOrder = i + 1; // Fixes your SortOrder bug

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
                    o.Question.Test.IsActive &&
                    o.Question.Test.LessonContent.LessonId == lessonId)
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
            }
        }
    }
}