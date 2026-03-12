using LMS.Backend.Data.Entities;
using LMS.Backend.Data.Repositories;
using LMS.Backend.Common;
using Microsoft.EntityFrameworkCore;
using LMS.Backend.Services.Interfaces;
using LMS.Backend.Repo.Interface;
using LMS.Backend.Data.Dbcontext;
using LMS.Backend.DTOs.Test_Quest;
using LMS.Backend.Data;

namespace LMS.Backend.Services;

public class JlptQuizService : IJlptQuizService
{
    private readonly IJlptQuizRepository _repo;
    private readonly AppDbContext _context;

    public JlptQuizService(IJlptQuizRepository repo, AppDbContext context)
    {
        _repo = repo;
        _context = context;
    }

    public async Task<List<QuizQuestionDto>> GetQuestionsForTestAsync(Guid testId)
    {
        var test = await _repo.GetTestWithItemsAsync(testId);
        if (test == null) return new List<QuizQuestionDto>();

        var dtos = new List<QuizQuestionDto>();

        foreach (var item in test.QuizItems.OrderBy(i => i.SortOrder))
        {
            var source = await _repo.GetSourceEntityAsync(item.SourceId, item.DisplayMode);
            if (source == null && item.DisplayMode != QuizDisplayMode.GrammarStar) continue;

            var dto = new QuizQuestionDto
            {
                QuizItemId = item.Id,
                DisplayMode = item.DisplayMode,
                Points = item.Points,
                SortOrder = item.SortOrder,
                Prompt = item.DisplayMode == QuizDisplayMode.GrammarStar ? "＿ ＿ ★ ＿" : (item.CustomPrompt ?? "")
            };

            // Setup Options based on Mode
            if (item.DisplayMode == QuizDisplayMode.GrammarStar)
            {
                // CustomPrompt format: "Part1|Part2|CorrectPart|Part4"
                dto.Options = item.CustomPrompt?.Split('|').OrderBy(_ => Guid.NewGuid()).ToList() ?? new();
            }
            else
            {
                await ApplyOptions(dto, source!, test.JlptLevel);
            }
            
            dtos.Add(dto);
        }
        return dtos;
    }

    public async Task<QuizResultDto> SubmitQuizAsync(QuizSubmissionDto submission)
    {
        var session = await _repo.GetSessionWithTestAsync(submission.SessionId);
        if (session == null) throw new Exception("Session not found");

        var result = new QuizResultDto { TotalPoints = 0, Score = 0 };
        var answersToSave = new List<QuizSessionAnswer>();

        foreach (var userAns in submission.Answers)
        {
            var item = session.Test.QuizItems.FirstOrDefault(i => i.Id == userAns.QuizItemId);
            if (item == null) continue;

            var source = await _repo.GetSourceEntityAsync(item.SourceId, item.DisplayMode);
            string correct = GetTargetAnswer(source, item);

            bool isCorrect = string.Equals(userAns.SelectedAnswer.Trim(), correct.Trim(), StringComparison.OrdinalIgnoreCase);
            
            if (isCorrect) result.Score += item.Points;
            result.TotalPoints += item.Points;

            // Aligning with the Details DTO for frontend summary
            result.Details.Add(new ResultDetailDto
            {
                QuestionPrompt = item.DisplayMode == QuizDisplayMode.GrammarStar ? "Star Puzzle" : item.CustomPrompt ?? "",
                UserAnswer = userAns.SelectedAnswer,
                CorrectAnswer = correct,
                IsCorrect = isCorrect
            });

            answersToSave.Add(new QuizSessionAnswer
            {
                QuizSessionId = session.Id,
                QuizItemId = item.Id,
                UserAnswer = userAns.SelectedAnswer,
                IsCorrect = isCorrect
            });
        }

        session.FinalScore = result.Score;
        session.FinishedAt = DateTime.UtcNow;
        session.IsPassed = result.Score >= (result.TotalPoints * (session.Test.PassingGrade / 100.0));
        
        await _repo.SaveSessionResultsAsync(session, answersToSave);
        return result;
    }

    private string GetTargetAnswer(object? source, QuizItem item)
    {
        if (item.DisplayMode == QuizDisplayMode.GrammarStar)
            return item.CustomPrompt?.Split('|')[2] ?? ""; // The 3rd element is the ★ position

        return item.DisplayMode switch
        {
            QuizDisplayMode.KanjiReading => (source as Kanji)?.Character ?? "",
            QuizDisplayMode.SynonymMatch => (source as Vocabulary)?.Meaning ?? (source as Kanji)?.Meaning ?? "",
            _ => (source as Vocabulary)?.Word ?? (source as Onomatopoeia)?.Phrase ?? ""
        };
    }

    private async Task ApplyOptions(QuizQuestionDto dto, object source, string? level)
    {
        // Simplifies distractor logic by using the Correct Answer as a base
        string correct = GetTargetAnswer(source, new QuizItem { DisplayMode = dto.DisplayMode });
        var options = new List<string> { correct };

        if (source is Kanji)
        {
            options.AddRange(await _context.Kanjis
                .Where(x => x.JlptLevel == level && x.Character != correct)
                .OrderBy(_ => Guid.NewGuid()).Take(3).Select(x => dto.DisplayMode == QuizDisplayMode.KanjiReading ? x.Character : x.Meaning).ToListAsync());
        }
        else
        {
            options.AddRange(await _context.Vocabularies
                .Where(x => x.JLPTLevel == level && x.Word != correct)
                .OrderBy(_ => Guid.NewGuid()).Take(3).Select(x => dto.DisplayMode == QuizDisplayMode.SynonymMatch ? x.Meaning : x.Word).ToListAsync());
        }
        dto.Options = options.OrderBy(_ => Guid.NewGuid()).ToList();
    }

    public async Task<List<JlptTestDto>> GetAvailableTestsAsync(string level, string category)
    {
        var tests = await _repo.GetTestsByJlptAsync(level, category);
        return tests.Select(t => new JlptTestDto
        {
            Id = t.Id,
            Title = t.Title,
            JlptLevel = t.JlptLevel,
            Category = t.Category,
            PassingGrade = t.PassingGrade,
            QuestionCount = t.QuizItems?.Count ?? 0
        }).ToList();
    }
}