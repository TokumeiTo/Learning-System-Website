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
        var existingTest = await _context.Tests
            .Include(t => t.Questions)
                .ThenInclude(q => q.Options)
            .FirstOrDefaultAsync(t => t.LessonContentId == lessonContentId);

        if (existingTest == null)
        {
            incomingTest.LessonContentId = lessonContentId;
            await _context.Tests.AddAsync(incomingTest);
            await _context.SaveChangesAsync();
            return incomingTest;
        }

        // 1. Update Test Metadata
        existingTest.Title = incomingTest.Title;
        existingTest.PassingGrade = incomingTest.PassingGrade;

        // 2. Manual Sync for Questions
        var incomingQIds = incomingTest.Questions.Select(q => q.Id).ToList();

        // Delete questions not in the incoming list
        var questionsToRemove = existingTest.Questions.Where(q => !incomingQIds.Contains(q.Id)).ToList();
        _context.Questions.RemoveRange(questionsToRemove);

        foreach (var incomingQ in incomingTest.Questions)
        {
            var existingQ = existingTest.Questions.FirstOrDefault(q => q.Id == incomingQ.Id);

            if (existingQ == null)
            {
                // NEW Question
                existingTest.Questions.Add(incomingQ);
            }
            else
            {
                // UPDATE Existing Question
                existingQ.QuestionText = incomingQ.QuestionText;
                existingQ.Points = incomingQ.Points;
                existingQ.SortOrder = incomingQ.SortOrder;

                // 3. Manual Sync for Options (Nested)
                var incomingOptIds = incomingQ.Options.Select(o => o.Id).ToList();

                // Delete removed options
                var optionsToRemove = existingQ.Options.Where(o => !incomingOptIds.Contains(o.Id)).ToList();
                _context.QuestionOptions.RemoveRange(optionsToRemove);

                foreach (var incomingOpt in incomingQ.Options)
                {
                    var existingOpt = existingQ.Options.FirstOrDefault(o => o.Id == incomingOpt.Id);
                    if (existingOpt == null)
                    {
                        existingQ.Options.Add(incomingOpt);
                    }
                    else
                    {
                        existingOpt.OptionText = incomingOpt.OptionText;
                        existingOpt.IsCorrect = incomingOpt.IsCorrect;
                    }
                }
            }
        }

        await _context.SaveChangesAsync();
        return existingTest;
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