using LMS.Backend.Data.Entities;

namespace LMS.Backend.Repo.Interface;

public interface IClassworkRepository : IBaseRepository<ClassworkTopic>
{
    // --- TOPIC OPERATIONS ---
    Task<ClassworkTopic> CreateTopicAsync(ClassworkTopic topic);
    Task<List<ClassworkTopic>> GetFullClassworkByCourseAsync(Guid courseId);
    Task<bool> TopicExistsAsync(Guid topicId);
    Task<bool> DeleteTopicAsync(Guid topicId);
    Task<ClassworkItem?> GetItemByIdAsync(Guid itemId);

    // --- ITEM & RESOURCE OPERATIONS (Admin) ---
    Task AddClassworkItemAsync(ClassworkItem item);
    Task AddResourceAsync(ClassworkResource resource);

    // --- SUBMISSION OPERATIONS (Student) ---
    /// <summary>
    /// Finds a submission by a specific user for a specific item.
    /// Used for the "Overwrite" logic in the Service layer.
    /// </summary>
    Task<ClassworkSubmission?> GetSubmissionByUserAsync(Guid itemId, string userId);
    Task<ClassworkSubmission?> GetSubmissionByIdAsync(Guid submissionId);
    Task CreateSubmissionAsync(ClassworkSubmission submission);
    Task UpdateSubmissionAsync(ClassworkSubmission submission);
    Task<List<ClassworkSubmission>> GetSubmissionsByItemAsync(Guid itemId);
    Task<bool> DeleteItemAsync(Guid itemId);
    Task<ClassworkTopic?> GetTopicWithItemsAsync(Guid topicId);
}