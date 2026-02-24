using LMS.Backend.DTOs.Test_Quest;

namespace LMS.Backend.Services.Interfaces;

public interface ITestService
{
    // Admin: Saves or Updates a test within a LessonContent block
    Task<bool> SaveTestToContentAsync(Guid contentId, TestDto dto);

    // Student: Grades the entire lesson based on multiple choice selections
    Task<LessonResultDto> GradeLessonAsync(string userId, LessonSubmissionDto submission);
}