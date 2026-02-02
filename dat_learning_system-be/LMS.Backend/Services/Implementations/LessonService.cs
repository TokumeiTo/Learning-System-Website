using AutoMapper;
using LMS.Backend.DTOs.Classroom;
using LMS.Backend.Repo.Interface;
using LMS.Backend.Services.Interfaces;

namespace LMS.Backend.Services.Implement;

public class LessonService(ILessonRepository repo, IMapper mapper) : ILessonService
{
    public async Task<ClassroomViewDto?> GetClassroomViewAsync(Guid courseId)
    {
        var course = await repo.GetClassroomStructureAsync(courseId);
        return course == null ? null : mapper.Map<ClassroomViewDto>(course);
    }
}