using AutoMapper;
using LMS.Backend.Data.Entities;
using LMS.Backend.DTOs.Test_Quest;
using LMS.Backend.Repo.Interface;
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
        // 1. Fetch the Test with its Questions and Correct Options
        // Note: We need the actual Test entity to get the PassingGrade and Question Points
        var test = await _testRepo.GetTestWithCorrectAnswersAsync(submission.LessonId);
        if (test == null) throw new KeyNotFoundException("No test found for this lesson");

        int earnedPoints = 0;
        int totalPoints = test.Questions.Sum(q => q.Points);

        // 2. Calculate weighted score
        foreach (var question in test.Questions)
        {
            if (submission.Answers.TryGetValue(question.Id, out Guid selectedOptionId))
            {
                var correctOption = question.Options.FirstOrDefault(o => o.IsCorrect);
                if (correctOption != null && correctOption.Id == selectedOptionId)
                {
                    earnedPoints += question.Points;
                }
            }
        }

        double percentage = totalPoints > 0 ? (double)earnedPoints / totalPoints * 100 : 0;

        // 3. Use PassingGrade from the TEST entity (not the Lesson)
        bool isPassed = percentage >= test.PassingGrade;

        // 4. Record the specific attempt
        var attempt = new LessonAttempt
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            LessonId = submission.LessonId,
            TestId = test.Id, // Link to the specific test version
            Score = earnedPoints,
            MaxScore = totalPoints,
            Percentage = Math.Round(percentage, 2),
            IsPassed = isPassed,
            AttemptedAt = DateTime.UtcNow
        };
        await _testRepo.CreateAttemptAsync(attempt);

        // 5. Automation: Mark lesson as done if passed
        if (isPassed)
        {
            await _progressRepo.MarkAsCompleteAsync(userId, submission.LessonId);
        }

        return new LessonResultDto
        {
            Score = earnedPoints,
            MaxScore = totalPoints,
            Percentage = (double)attempt.Percentage,
            IsPassed = isPassed,
            AttemptedAt = attempt.AttemptedAt
        };
    }
}