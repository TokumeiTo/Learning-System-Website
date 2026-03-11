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
            if (source == null) continue;

            var dto = new QuizQuestionDto
            {
                QuizItemId = item.Id,
                DisplayMode = item.DisplayMode,
                Points = item.Points,
                SortOrder = item.SortOrder,
                Prompt = item.CustomPrompt ?? "Missing Prompt"
            };

            await ProcessByMode(dto, source, test.JlptLevel);
            dtos.Add(dto);
        }

        return dtos;
    }

    private async Task ProcessByMode(QuizQuestionDto dto, object source, string? level)
    {
        switch (dto.DisplayMode)
        {
            case QuizDisplayMode.GrammarStar:
                // CustomPrompt format: "Part1|Part2|Part3|Part4"
                var parts = dto.Prompt.Split('|').ToList();
                dto.Prompt = "＿ ＿ ★ ＿";
                dto.Options = parts.OrderBy(_ => Guid.NewGuid()).ToList();
                break;

            case QuizDisplayMode.KanjiReading:
                // Question: Reading -> Answer: Character (金)
                await ApplyOptions(dto, source, level, useCharacter: true);
                break;

            case QuizDisplayMode.SynonymMatch:
                // Question: Word -> Answer: Meaning (夜はいつも)
                await ApplyOptions(dto, source, level, useMeaning: true);
                break;

            case QuizDisplayMode.MeaningMatch:
            case QuizDisplayMode.ContextFill:
                // Question: Context -> Answer: Word (アパート)
                await ApplyOptions(dto, source, level, useWord: true);
                break;
        }
    }

    private async Task ApplyOptions(QuizQuestionDto dto, object source, string? level,
        bool useCharacter = false, bool useMeaning = false, bool useWord = false)
    {
        // 1. Identify the Correct Answer based on the mode
        string correct = "";
        if (useCharacter && source is Kanji k) correct = k.Character;
        else if (useMeaning) correct = source is Vocabulary v ? v.Meaning : ((Kanji)source).Meaning;
        else correct = source is Vocabulary voc ? voc.Word : (source is Onomatopoeia o ? o.Phrase : "");

        var options = new List<string> { correct };

        // 2. Fetch 3 random distractors from the same JLPT level
        if (source is Kanji)
        {
            var distractors = await _context.Kanjis
                .Where(x => x.JlptLevel == level && x.Character != correct && x.Meaning != correct)
                .OrderBy(_ => Guid.NewGuid()).Take(3)
                .Select(x => useCharacter ? x.Character : x.Meaning)
                .ToListAsync();
            options.AddRange(distractors);
        }
        else
        {
            var distractors = await _context.Vocabularies
                .Where(x => x.JLPTLevel == level && x.Word != correct && x.Meaning != correct)
                .OrderBy(_ => Guid.NewGuid()).Take(3)
                .Select(x => useMeaning ? x.Meaning : x.Word)
                .ToListAsync();
            options.AddRange(distractors);
        }

        dto.Options = options.OrderBy(_ => Guid.NewGuid()).ToList();
    }

    public async Task<QuizResultDto> SubmitQuizAsync(QuizSubmissionDto submission)
    {
        var session = await _repo.GetSessionWithTestAsync(submission.SessionId);
        if (session == null) throw new Exception("Session not found");

        var result = new QuizResultDto();
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

            result.Feedback.Add(new AnswerFeedbackDto
            {
                QuizItemId = item.Id,
                IsCorrect = isCorrect,
                CorrectAnswer = correct
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
        session.IsPassed = result.Score >= session.Test.PassingGrade;
        await _repo.SaveSessionResultsAsync(session, answersToSave);

        result.IsPassed = session.IsPassed;
        return result;
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
    private string GetTargetAnswer(object? source, QuizItem item)
    {
        if (item.DisplayMode == QuizDisplayMode.GrammarStar)
            return item.CustomPrompt?.Split('|')[2] ?? "";

        return item.DisplayMode switch
        {
            QuizDisplayMode.KanjiReading => ((Kanji)source!).Character,
            QuizDisplayMode.SynonymMatch => source is Vocabulary v ? v.Meaning : ((Kanji)source!).Meaning,
            _ => source is Vocabulary voc ? voc.Word : (source is Onomatopoeia o ? o.Phrase : "")
        };
    }
}