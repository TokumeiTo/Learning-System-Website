using LMS.Backend.DTOs.Classwork;

namespace LMS.Backend.Services.Interfaces;

public interface IClassworkService
{
    // Topic logic
    Task<ClassworkTopicDto> AddTopicAsync(CreateClassworkTopicDto dto, string adminUserId);
    Task<List<ClassworkTopicDto>> GetCourseClassworkAsync(Guid courseId, string? userId = null)
;
    Task<bool> RemoveTopicAsync(Guid topicId);

    // Item/Assignment logic
    Task<ClassworkItemDto> AddClassworkItemAsync(CreateClassworkItemDto dto, string adminUserId);

    // Submission logic (The Overwrite Way)
    Task<ClassworkSubmissionDto> SubmitWorkAsync(SubmitClassworkDto dto, string userId);
    Task<ClassworkSubmissionDto> GradeSubmissionAsync(Guid submissionId, double grade, string? feedback);
    Task<bool> RemoveItemAsync(Guid itemId);
}