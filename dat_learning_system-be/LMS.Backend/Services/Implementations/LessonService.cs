using AutoMapper;
using LMS.Backend.Data.Entities;
using LMS.Backend.Data.Repositories.Interfaces;
using LMS.Backend.DTOs.Classroom;
using LMS.Backend.DTOs.Lesson;
using LMS.Backend.Repo.Interface;
using LMS.Backend.Services.Interfaces;

namespace LMS.Backend.Services.Implement;

public class LessonService(
    ILessonRepository repo,
    IUserProgressRepository progressRepo, // Inject the progress repo
    IMapper mapper) : ILessonService
{
    public async Task<ClassroomLessonDto> CreateLessonAsync(CreateLessonDto dto)
    {
        var lesson = mapper.Map<Lesson>(dto);

        // default placing at end order
        if (lesson.SortOrder <= 0)
        {
            lesson.SortOrder = await repo.GetNextSortOrderAsync(dto.CourseId);
        }

        var createdLesson = await repo.CreateLessonAsync(lesson);

        return mapper.Map<ClassroomLessonDto>(createdLesson);

    }

    public async Task ReorderLessonsAsync(ReorderLessonsDto dto)
    {
        // We call the repo method you wrote
        await repo.ReOrderLessonsAsync(dto.CourseId, dto.LessonIds);
    }

    public async Task<ClassroomViewDto?> GetClassroomViewAsync(Guid courseId, string userId)
    {
        // 1. Fetch the static structure (Now including Tests/Questions/Options via the Repo update)
        var course = await repo.GetClassroomStructureAsync(courseId);
        if (course == null) return null;

        // 2. Map to DTO
        var viewDto = mapper.Map<ClassroomViewDto>(course);

        // --- NEW: TEST SHUFFLE & SECURITY LOGIC ---
        foreach (var lessonDto in viewDto.Lessons)
        {
            // Filter for content blocks that are tests and have data
            var testContents = lessonDto.Contents
                .Where(c => c.ContentType == "test" && c.Test != null);

            foreach (var content in testContents)
            {
                foreach (var question in content.Test!.Questions)
                {
                    // 1. Randomize Option Order
                    question.Options = question.Options.OrderBy(_ => Guid.NewGuid()).ToList();

                    // 2. Hide Correct Answers (Set bool? to null)
                    foreach (var opt in question.Options)
                    {
                        opt.IsCorrect = null;
                    }
                }
            }
        }
        // ------------------------------------------

        // 3. Fetch user progress
        var userProgress = await progressRepo.GetUserProgressForCourseAsync(userId, courseId);

        // 4. DYNAMIC LOGIC: Checkmarks and padlocks
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
        var entities = mapper.Map<List<LessonContent>>(dto.Contents);
        await repo.SaveLessonContentsAsync(dto.LessonId, entities);
    }

    public async Task<ClassroomLessonDto> UpdateLessonAsync(UpdateLessonDto dto)
    {
        var lesson = await repo.GetByIdAsync(dto.Id);
        if (lesson == null) throw new KeyNotFoundException("Lesson not found");

        // Map DTO properties onto the existing tracked entity
        mapper.Map(dto, lesson);

        repo.Update(lesson);
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