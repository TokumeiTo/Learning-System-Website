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

    public async Task<bool> SaveTestAsync(Guid? contentId, TestDto dto)
    {
        var incomingTest = _mapper.Map<Test>(dto);
        if (contentId == null)
        {
            incomingTest.IsGlobal = true;
            incomingTest.LessonContentId = null;
        }
        else
        {
            incomingTest.IsGlobal = false;
            incomingTest.LessonContentId = contentId;
        }
        var result = await _testRepo.UpsertTestAsync(contentId ?? Guid.Empty, incomingTest);
        return result != null;
    }

    public async Task<QuizResultDto> GradQuizAsync(string userId, QuizSubmissionDto submission)
    {
        // 1. Fetch the Test (Specific Version) with Answers
        var test = await _testRepo.GetTestByIdWithAnswersAsync(submission.TestId);
        if (test == null) throw new KeyNotFoundException("Specified test not found.");

        var correctMapping = test.Questions.ToDictionary(
            q => q.Id,
            q => q.Options.FirstOrDefault(o => o.IsCorrect)?.Id ?? Guid.Empty
        );

        // 2. Calculate weighted score
        int earnedPoints = 0;
        foreach (var question in test.Questions)
        {
            if (submission.Answers.TryGetValue(question.Id, out Guid selectedOptionId))
            {
                var correctOption = question.Options.FirstOrDefault(o => o.IsCorrect);
                if (selectedOptionId != Guid.Empty && correctOption != null && correctOption.Id == selectedOptionId)
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
        var attemptData = new LessonAttempt
        {
            UserId = userId,
            LessonId = (submission.LessonId == Guid.Empty) ? null : submission.LessonId,
            TestId = test.Id,
            Score = earnedPoints,
            MaxScore = totalPoints,
            Percentage = Math.Round(percentage, 2),
            IsPassed = isPassed,
            AnswerJson = System.Text.Json.JsonSerializer.Serialize(submission.Answers)
        };

        // Use the new Upsert logic
        var finalAttempt = await _testRepo.UpsertAttemptAsync(attemptData);

        // 5. Automation: Mark lesson complete
        if (isPassed && submission.LessonId != Guid.Empty && submission.LessonId != null)
        {
            await _progressRepo.MarkAsCompleteAsync(userId, submission.LessonId.Value);
        }

        return new QuizResultDto
        {
            TestId = finalAttempt.TestId,
            Score = finalAttempt.Score,
            MaxScore = finalAttempt.MaxScore,
            Percentage = finalAttempt.Percentage,
            IsPassed = finalAttempt.IsPassed,
            AttemptedAt = finalAttempt.AttemptedAt,
            Attempts = finalAttempt.Attempts,
            UserAnswers = submission.Answers,
            CorrectAnswers = correctMapping
        };
    }

    // In LessonAttemptService.cs
    public async Task<List<QuizResultDto>> GetMyAttemptsByLevelAsync(string userId, string level)
    {
        var attempts = await _testRepo.GetAttemptsByLevelAsync(userId, level);

        // Map to your DTO so the frontend gets the expected structure
        return _mapper.Map<List<QuizResultDto>>(attempts);
    }
}