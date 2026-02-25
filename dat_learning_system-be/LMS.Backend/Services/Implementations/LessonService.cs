using AutoMapper;
using LMS.Backend.Data.Entities;
using LMS.Backend.DTOs.Classroom;
using LMS.Backend.DTOs.Lesson;
using LMS.Backend.Repo.Interface;
using LMS.Backend.Services.Interfaces;
using System.Text.Json;

namespace LMS.Backend.Services.Implement;

public class LessonService(
    ILessonRepository repo,
    ITestRepository testRepo,
    ILessonAttemptRepository attemptRepo,
    IUserProgressRepository progressRepo,
    IMapper mapper) : ILessonService
{
    public async Task<ClassroomLessonDto> CreateLessonAsync(CreateLessonDto dto)
    {
        var lesson = mapper.Map<Lesson>(dto);

        if (lesson.SortOrder <= 0)
        {
            lesson.SortOrder = await repo.GetNextSortOrderAsync(dto.CourseId);
        }

        var createdLesson = await repo.CreateLessonAsync(lesson);
        return mapper.Map<ClassroomLessonDto>(createdLesson);
    }

    public async Task ReorderLessonsAsync(ReorderLessonsDto dto)
    {
        await repo.ReOrderLessonsAsync(dto.CourseId, dto.LessonIds);
    }

    public async Task<ClassroomViewDto?> GetClassroomViewAsync(Guid courseId, string userId)
    {
        var course = await repo.GetClassroomStructureAsync(courseId);
        if (course == null) return null;

        var viewDto = mapper.Map<ClassroomViewDto>(course);

        // --- SHUFFLE & SECURITY LOGIC ---
        foreach (var lessonDto in viewDto.Lessons)
        {
            var testContents = lessonDto.Contents
                .Where(c => c.ContentType == "test" && c.Test != null);

            foreach (var content in testContents)
            {
                foreach (var question in content.Test!.Questions)
                {
                    // 1. Randomize Option Order for student
                    question.Options = question.Options.OrderBy(_ => Guid.NewGuid()).ToList();

                    // 2. Hide Correct Answers from Network Tab
                    foreach (var opt in question.Options)
                    {
                        opt.IsCorrect = null;
                    }
                }
            }
        }

        // --- PROGRESS & LOCKING LOGIC ---
        var userProgress = await progressRepo.GetUserProgressForCourseAsync(userId, courseId);
        bool previousCompleted = true;

        foreach (var lessonDto in viewDto.Lessons)
        {
            var progress = userProgress.FirstOrDefault(p => p.LessonId == lessonDto.Id);
            lessonDto.IsDone = progress?.IsCompleted ?? false;
            lessonDto.IsLocked = !previousCompleted;
            previousCompleted = lessonDto.IsDone;
        }

        return viewDto;
    }

    public async Task BulkSaveContentsAsync(SaveLessonContentsDto dto)
    {
        var contents = mapper.Map<List<LessonContent>>(dto.Contents);

        await repo.SaveLessonContentsAsync(dto.LessonId, contents);

        foreach (var itemDto in dto.Contents.Where(x => x.ContentType == "test" && x.Test != null))
        {
            var contentId = itemDto.Id ?? Guid.Empty;

            if (contentId == Guid.Empty)
            {
                contentId = contents.First(c => c.SortOrder == itemDto.SortOrder).Id;
            }

            var testEntity = mapper.Map<Test>(itemDto.Test);
            await testRepo.UpsertTestAsync(contentId, testEntity);
        }
    }

    // --- ADDED: THE MISSING GRADING FUNCTION ---
    public async Task<QuizResultDto> SubmitQuizAsync(string userId, SubmitQuizDto dto)
    {
        // 1. Fetch Test with Answers (Server-side Truth)
        var test = await testRepo.GetTestWithCorrectAnswersAsync(dto.TestId);
        if (test == null) throw new KeyNotFoundException("Test not found");

        int earnedPoints = 0;
        int totalPoints = test.Questions.Sum(q => q.Points);

        // 2. Manual Grading Logic
        foreach (var question in test.Questions)
        {
            if (dto.Answers.TryGetValue(question.Id, out Guid selectedOptionId))
            {
                var correctOption = question.Options.FirstOrDefault(o => o.IsCorrect);
                if (correctOption != null && correctOption.Id == selectedOptionId)
                {
                    earnedPoints += question.Points;
                }
            }
        }

        double percentage = totalPoints > 0 ? (double)earnedPoints / totalPoints * 100 : 0;
        bool isPassed = percentage >= test.PassingGrade;

        // 3. Save Attempt (Uses attemptRepo)
        var attempt = new LessonAttempt
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            LessonId = test.LessonContent.LessonId,
            TestId = test.Id,
            Score = earnedPoints,
            MaxScore = totalPoints,
            Percentage = percentage,
            IsPassed = isPassed,
            AnswerJson = JsonSerializer.Serialize(dto.Answers),
            AttemptedAt = DateTime.UtcNow
        };

        await attemptRepo.CreateAttemptAsync(attempt);

        // 4. Update Course Progress if Passed
        if (isPassed)
        {
            await progressRepo.MarkAsCompleteAsync(userId, attempt.LessonId);
        }

        return new QuizResultDto
        {
            Score = earnedPoints,
            MaxScore = totalPoints,
            Percentage = Math.Round(percentage, 2),
            IsPassed = isPassed,
            CorrectOptionIds = test.Questions
                .SelectMany(q => q.Options)
                .Where(o => o.IsCorrect)
                .Select(o => o.Id)
                .ToList()
        };
    }

    public async Task<ClassroomLessonDto> UpdateLessonAsync(UpdateLessonDto dto)
    {
        var lesson = await repo.GetByIdAsync(dto.Id);
        if (lesson == null) throw new KeyNotFoundException("Lesson not found");

        lesson.Title = dto.Title;
        lesson.Time = dto.Time;

        await repo.SaveChangesAsync();
        return mapper.Map<ClassroomLessonDto>(lesson);
    }

    public async Task<bool> DeleteLessonAsync(Guid id)
    {
        var lesson = await repo.GetByIdAsync(id);
        if (lesson == null) return false;

        await repo.DeleteLessonAsync(id);
        return true;
    }
}