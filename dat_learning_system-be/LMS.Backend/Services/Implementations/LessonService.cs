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
        // 1. Fetch the static structure (Lessons + Contents)
        var course = await repo.GetClassroomStructureAsync(courseId);
        if (course == null) return null;

        // 2. Map to DTO (IsDone and IsLocked are 'false' by default here)
        var viewDto = mapper.Map<ClassroomViewDto>(course);

        // 3. Fetch the specific user's progress for all lessons in this course
        var userProgress = await progressRepo.GetUserProgressForCourseAsync(userId, courseId);

        // 4. DYNAMIC LOGIC: Calculate checkmarks and padlocks
        bool previousCompleted = true; // The first lesson is always unlocked

        foreach (var lessonDto in viewDto.Lessons)
        {
            var progress = userProgress.FirstOrDefault(p => p.LessonId == lessonDto.Id);

            // IsDone comes from the database record
            lessonDto.IsDone = progress?.IsCompleted ?? false;

            // IsLocked is true if the one before it wasn't finished
            lessonDto.IsLocked = !previousCompleted;

            // Update for the next lesson in the loop
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