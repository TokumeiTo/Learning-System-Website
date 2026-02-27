using AutoMapper;
using LMS.Backend.Data.Entities;
using LMS.Backend.DTOs.Test_Quest;
using LMS.Backend.Repo.Interface;
using LMS.Backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace LMS.Backend.Services.Implement;

public class TestService : ITestService
{
    private readonly ITestRepository _testRepo;
    private readonly IUserProgressRepository _progressRepo;
    private readonly IMapper _mapper;

    public TestService(
        ITestRepository testRepo,
        IUserProgressRepository progressRepo,
        IMapper mapper)
    {
        _testRepo = testRepo;
        _progressRepo = progressRepo;
        _mapper = mapper;
    }

    public async Task<bool> SaveTestToContentAsync(Guid contentId, TestDto dto)
    {
        var incomingTest = _mapper.Map<Test>(dto);
        var result = await _testRepo.UpsertTestAsync(contentId, incomingTest);
        return result != null;
    }

    public async Task<LessonResultDto> GradeLessonAsync(string userId, LessonSubmissionDto submission)
    {
        // 1. Fetch the Test (Specific Version) with Answers
        var test = await _testRepo.GetTestByIdWithAnswersAsync(submission.TestId);
        if (test == null) throw new KeyNotFoundException("Specified test not found.");

        // 2. Calculate weighted score
        int earnedPoints = 0;
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

        int totalPoints = test.Questions.Sum(q => q.Points);

        // 3. Calculate percentage using decimal for precision
        // We cast the numerator to decimal first to avoid integer division bugs
        decimal percentage = totalPoints > 0
            ? (decimal)earnedPoints / totalPoints * 100
            : 0m;

        // Compare decimal percentage against int PassingGrade
        bool isPassed = percentage >= test.PassingGrade;

        // 4. Record the specific attempt
        var attempt = new LessonAttempt
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            LessonId = submission.LessonId,
            TestId = test.Id,
            Score = earnedPoints,
            MaxScore = totalPoints,
            Percentage = Math.Round(percentage, 2), // Keep 2 decimal places
            IsPassed = isPassed,
            AttemptedAt = DateTime.UtcNow,
            AnswerJson = System.Text.Json.JsonSerializer.Serialize(submission.Answers)
        };

        await _testRepo.CreateAttemptAsync(attempt);

        // 5. Automation: Mark lesson as complete if passed
        if (isPassed)
        {
            await _progressRepo.MarkAsCompleteAsync(userId, submission.LessonId);
        }

        // 6. Return Result (Cast percentage to double if your DTO requires it)
        return new LessonResultDto
        {
            Score = earnedPoints,
            MaxScore = totalPoints,
            Percentage = attempt.Percentage,
            IsPassed = isPassed,
            AttemptedAt = attempt.AttemptedAt
        };
    }
}