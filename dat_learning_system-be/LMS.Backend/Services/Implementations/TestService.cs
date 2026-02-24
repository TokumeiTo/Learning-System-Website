using AutoMapper;
using LMS.Backend.Data.Entities;
using LMS.Backend.DTOs.Test_Quest;
using LMS.Backend.Repo.Interface;
using LMS.Backend.Data.Repositories.Interfaces;
using LMS.Backend.Services.Interfaces;

namespace LMS.Backend.Services.Implement;

public class TestService : ITestService
{
    private readonly ITestRepository _testRepo;
    private readonly ILessonRepository _lessonRepo;
    private readonly IUserProgressRepository _progressRepo;
    private readonly IMapper _mapper;

    public TestService(
        ITestRepository testRepo, 
        ILessonRepository lessonRepo, 
        IUserProgressRepository progressRepo,
        IMapper mapper)
    {
        _testRepo = testRepo;
        _lessonRepo = lessonRepo;
        _progressRepo = progressRepo;
        _mapper = mapper;
    }

    public async Task<bool> SaveTestToContentAsync(Guid contentId, TestDto dto)
    {
        var testEntity = _mapper.Map<Test>(dto);
        await _testRepo.UpsertTestAsync(contentId, testEntity);
        return true;
    }

    public async Task<LessonResultDto> GradeLessonAsync(string userId, LessonSubmissionDto submission)
    {
        // 1. Fetch correct IDs and Max points
        var correctOptionIds = await _testRepo.GetCorrectOptionIdsForLessonAsync(submission.LessonId);
        var maxScore = await _testRepo.GetTotalPointsForLessonAsync(submission.LessonId);
        
        // 2. Calculate score
        var score = submission.SelectedOptionIds.Count(id => correctOptionIds.Contains(id));
        double percentage = maxScore > 0 ? (double)score / maxScore * 100 : 0;

        // 3. Check against passing threshold
        var lesson = await _lessonRepo.GetByIdAsync(submission.LessonId);
        int passingThreshold = lesson?.PassingScore ?? 70;
        bool isPassed = percentage >= passingThreshold;

        // 4. Record the specific attempt
        var attempt = new LessonAttempt
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            LessonId = submission.LessonId,
            Score = score,
            MaxScore = maxScore,
            Percentage = Math.Round(percentage, 2),
            IsPassed = isPassed,
            AttemptedAt = DateTime.UtcNow
        };
        await _testRepo.CreateAttemptAsync(attempt);

        // 5. AUTOMATION: Use your existing MarkAsCompleteAsync
        if (isPassed)
        {
            // This ensures the green checkmark appears in the classroom view
            await _progressRepo.MarkAsCompleteAsync(userId, submission.LessonId);
        }

        return new LessonResultDto
        {
            Score = score,
            MaxScore = maxScore,
            Percentage = attempt.Percentage,
            IsPassed = isPassed,
            AttemptedAt = attempt.AttemptedAt
        };
    }
}