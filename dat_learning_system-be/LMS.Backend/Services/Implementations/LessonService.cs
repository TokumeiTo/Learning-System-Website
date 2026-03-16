using AutoMapper;
using LMS.Backend.Data.Entities;
using LMS.Backend.DTOs.Classroom;
using LMS.Backend.DTOs.Lesson;
using LMS.Backend.Repo.Interface;
using LMS.Backend.Services.Interfaces;

namespace LMS.Backend.Services.Implement;

public class LessonService(
    ILessonRepository repo,
    ITestService testService,
    IUserProgressRepository progressRepo,
    IMediaHandlerService mediaHandler, // Injected shared handler
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
        var course = await repo.GetClassroomStructureAsync(courseId);
        if (course == null) return null;

        var viewDto = mapper.Map<ClassroomViewDto>(course, opt => opt.Items["IsAdmin"] = isAdmin);

        foreach (var lessonDto in viewDto.Lessons)
        {
            var testContents = lessonDto.Contents
                .Where(c => c.ContentType == "test" && c.Test != null);

            foreach (var content in testContents)
            {
                foreach (var question in content.Test!.Questions)
                {
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

        var userProgress = await progressRepo.GetUserProgressForCourseAsync(userId, courseId);
        bool previousCompleted = true;

        foreach (var lessonDto in viewDto.Lessons)
        {
            var progress = userProgress.FirstOrDefault(p => p.LessonId == lessonDto.Id);
            lessonDto.IsDone = progress?.IsCompleted ?? false;

            var lessonEntity = course.Lessons.FirstOrDefault(l => l.Id == lessonDto.Id);
            if (lessonEntity != null)
            {
                var bestAttempt = lessonEntity.Attempts
                    .Where(a => a.UserId == userId)
                    .OrderByDescending(a => a.Percentage)
                    .FirstOrDefault();

                lessonDto.LastScore = bestAttempt?.Percentage;
            }

            lessonDto.IsLocked = !previousCompleted;
            previousCompleted = lessonDto.IsDone;
        }

        return viewDto;
    }

    public async Task BulkSaveContentsAsync(SaveLessonContentsDto dto)
    {
        foreach (var itemDto in dto.Contents)
        {
            // Clean logic using the shared MediaHandler
            if (itemDto.ContentType == "image" || itemDto.ContentType == "video" || itemDto.ContentType == "file")
            {
                if (!string.IsNullOrEmpty(itemDto.Body))
                {
                    itemDto.Body = await mediaHandler.HandleBase64MediaAsync(itemDto.Body, itemDto.ContentType);
                }
            }
        }

        var contents = mapper.Map<List<LessonContent>>(dto.Contents);
        await repo.SaveLessonContentsAsync(dto.LessonId, contents);

        for (int i = 0; i < dto.Contents.Count; i++)
        {
            var itemDto = dto.Contents[i];

            if (itemDto.ContentType == "test" && itemDto.Test != null)
            {
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