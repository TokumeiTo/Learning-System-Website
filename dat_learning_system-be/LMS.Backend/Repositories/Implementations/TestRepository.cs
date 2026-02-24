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

    public async Task<Test> UpsertTestAsync(Guid lessonContentId, Test test)
    {
        // Check if a test already exists for this specific content block
        var existingTest = await _context.Tests
            .Include(t => t.Questions)
            .ThenInclude(q => q.Options)
            .FirstOrDefaultAsync(t => t.LessonContentId == lessonContentId);

        if (existingTest != null)
        {
            // Simple approach: Clear old questions and options and add new ones
            _context.Questions.RemoveRange(existingTest.Questions);
            
            existingTest.Questions = test.Questions;
            _context.Tests.Update(existingTest);
        }
        else
        {
            test.LessonContentId = lessonContentId;
            await _context.Tests.AddAsync(test);
        }

        await _context.SaveChangesAsync();
        return existingTest ?? test;
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