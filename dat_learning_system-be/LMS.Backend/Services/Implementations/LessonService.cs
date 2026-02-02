using AutoMapper;
using LMS.Backend.Data.Entities;
using LMS.Backend.DTOs.Classroom;
using LMS.Backend.DTOs.Lesson;
using LMS.Backend.Repo.Interface;
using LMS.Backend.Services.Interfaces;

namespace LMS.Backend.Services.Implement;

public class LessonService(ILessonRepository repo, IMapper mapper) : ILessonService
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

    public async Task<ClassroomViewDto?> GetClassroomViewAsync(Guid courseId)
    {
        var course = await repo.GetClassroomStructureAsync(courseId);
        return course == null ? null : mapper.Map<ClassroomViewDto>(course);
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