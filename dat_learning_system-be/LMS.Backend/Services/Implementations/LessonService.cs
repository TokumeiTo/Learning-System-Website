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
    ITestService testService,
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

    public async Task<ClassroomViewDto?> GetClassroomViewAsync(Guid courseId, string userId, bool isAdmin)
    {
        // 1. Fetch course structure
        var course = await repo.GetClassroomStructureAsync(courseId);
        if (course == null) return null;

        // 2. Map to DTO
        var viewDto = mapper.Map<ClassroomViewDto>(course, opt => opt.Items["IsAdmin"] = isAdmin);

        // 3. Shuffle Options & Hide Answers for Students
        foreach (var lessonDto in viewDto.Lessons)
        {
            var testContents = lessonDto.Contents
                .Where(c => c.ContentType == "test" && c.Test != null);

            foreach (var content in testContents)
            {
                foreach (var question in content.Test!.Questions)
                {
                    // Randomize for student variety
                    question.Options = question.Options.OrderBy(_ => Guid.NewGuid()).ToList();

                    if (!isAdmin)
                    {
                        foreach (var opt in question.Options)
                        {
                            opt.IsCorrect = null;
                        }
                    }
                }
            }
        }

        // 4. Progress, Scoring & Locking Logic
        var userProgress = await progressRepo.GetUserProgressForCourseAsync(userId, courseId);
        bool previousCompleted = true;

        foreach (var lessonDto in viewDto.Lessons)
        {
            // A. Set Completion Status
            var progress = userProgress.FirstOrDefault(p => p.LessonId == lessonDto.Id);
            lessonDto.IsDone = progress?.IsCompleted ?? false;

            // B. Get Best Score for this User (from the included Attempts)
            var lessonEntity = course.Lessons.FirstOrDefault(l => l.Id == lessonDto.Id);
            if (lessonEntity != null)
            {
                var bestAttempt = lessonEntity.Attempts
                    .Where(a => a.UserId == userId)
                    .OrderByDescending(a => a.Percentage)
                    .FirstOrDefault();

                lessonDto.LastScore = bestAttempt?.Percentage;
            }

            // C. Handle Locking
            lessonDto.IsLocked = !previousCompleted;

            // The next lesson is unlocked if the current one is done
            previousCompleted = lessonDto.IsDone;
        }

        return viewDto;
    }

    public async Task BulkSaveContentsAsync(SaveLessonContentsDto dto)
    {
        // 1. Map everything
        var contents = mapper.Map<List<LessonContent>>(dto.Contents);

        // 2. Save the primary content list first to generate IDs for new items
        // This is the "Manual Sync" step in your repository
        await repo.SaveLessonContentsAsync(dto.LessonId, contents);

        // 3. Iterate through the DTOs using a loop to maintain the relationship
        for (int i = 0; i < dto.Contents.Count; i++)
        {
            var itemDto = dto.Contents[i];

            // Only proceed if it's a test
            if (itemDto.ContentType == "test" && itemDto.Test != null)
            {
                // Get the ID from the saved entity at the same position
                var contentId = contents[i].Id;

                await testService.SaveTestToContentAsync(contentId, itemDto.Test);
            }
        }
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