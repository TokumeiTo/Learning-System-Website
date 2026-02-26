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
    public async Task<Test?> GetTestWithCorrectAnswersAsync(Guid lessonId)
    {
        return await _context.Tests
            .Include(t => t.Questions)
                .ThenInclude(q => q.Options)
            // Ensure you are matching the LESSON ID stored on the LessonContent
            .FirstOrDefaultAsync(t => t.LessonContent.LessonId == lessonId);
    }
    public async Task<Test> UpsertTestAsync(Guid lessonContentId, Test incomingTest)
    {
        // 1. Load the existing test with the full tracking tree
        var existingTest = await _context.Tests
            .Include(t => t.Questions)
                .ThenInclude(q => q.Options)
            .FirstOrDefaultAsync(t => t.LessonContentId == lessonContentId);

        if (existingTest == null)
        {
            incomingTest.LessonContentId = lessonContentId;
            ProcessNewTestTree(incomingTest);
            await _context.Tests.AddAsync(incomingTest);
            await _context.SaveChangesAsync();
            return incomingTest;
        }

        // 2. Update Test Metadata
        existingTest.Title = incomingTest.Title;
        existingTest.PassingGrade = incomingTest.PassingGrade;

        // 3. Sync Questions
        var incomingQs = incomingTest.Questions.ToList();
        var incomingQIds = incomingQs.Select(q => q.Id).Where(id => id != Guid.Empty).ToList();

        // REMOVE: Questions that are in DB but NOT in the incoming request
        var questionsToRemove = existingTest.Questions
            .Where(q => !incomingQIds.Contains(q.Id))
            .ToList();

        foreach (var qRem in questionsToRemove)
        {
            _context.Questions.Remove(qRem); // Use Remove on context for cleaner tracking
        }

        for (int i = 0; i < incomingQs.Count; i++)
        {
            var incomingQ = incomingQs[i];

            // Find existing question ONLY if ID is not empty
            var existingQ = (incomingQ.Id == Guid.Empty)
                ? null
                : existingTest.Questions.FirstOrDefault(q => q.Id == incomingQ.Id);

            if (existingQ == null)
            {
                // --- NEW QUESTION ---
                incomingQ.Id = Guid.NewGuid();
                incomingQ.TestId = existingTest.Id;
                incomingQ.SortOrder = i + 1;

                foreach (var opt in incomingQ.Options)
                {
                    opt.Id = Guid.NewGuid();
                    opt.QuestionId = incomingQ.Id;
                }
                // Use the context to Add specifically to ensure it's marked as 'Added'
                await _context.Questions.AddAsync(incomingQ);
            }
            else
            {
                // --- UPDATE EXISTING QUESTION ---
                existingQ.QuestionText = incomingQ.QuestionText;
                existingQ.Points = incomingQ.Points;
                existingQ.SortOrder = i + 1;

                // Sync Options
                var incomingOpts = incomingQ.Options.ToList();
                var incomingOptIds = incomingOpts.Select(o => o.Id).Where(id => id != Guid.Empty).ToList();

                var optionsToRemove = existingQ.Options
                    .Where(o => !incomingOptIds.Contains(o.Id))
                    .ToList();

                foreach (var oRem in optionsToRemove)
                {
                    _context.QuestionOptions.Remove(oRem);
                }

                foreach (var incomingOpt in incomingOpts)
                {
                    var existingOpt = (incomingOpt.Id == Guid.Empty)
                        ? null
                        : existingQ.Options.FirstOrDefault(o => o.Id == incomingOpt.Id);

                    if (existingOpt == null)
                    {
                        // NEW OPTION
                        incomingOpt.Id = Guid.NewGuid();
                        incomingOpt.QuestionId = existingQ.Id;
                        await _context.QuestionOptions.AddAsync(incomingOpt);
                    }
                    else
                    {
                        // UPDATE OPTION
                        existingOpt.OptionText = incomingOpt.OptionText;
                        existingOpt.IsCorrect = incomingOpt.IsCorrect;
                    }
                }
            }
        }

        await _context.SaveChangesAsync();
        return existingTest;
    }
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
        // Get all correct options across ALL test blocks in a specific lesson
        return await _context.QuestionOptions
            .Where(o => o.IsCorrect && o.Question.Test.LessonContent.LessonId == lessonId)
            .Select(o => o.Id)
            .ToListAsync();
    }

    public async Task<int> GetTotalPointsForLessonAsync(Guid lessonId)
    {
        return await _context.Questions
            .Where(q => q.Test.LessonContent.LessonId == lessonId)
            .SumAsync(q => q.Points);
    }

    public async Task<LessonAttempt> CreateAttemptAsync(LessonAttempt attempt)
    {
        await _context.LessonAttempts.AddAsync(attempt);
        await _context.SaveChangesAsync();
        return attempt;
    }
}