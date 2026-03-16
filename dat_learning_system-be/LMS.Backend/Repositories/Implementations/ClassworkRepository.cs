using LMS.Backend.Data.Dbcontext;
using LMS.Backend.Data.Entities;
using LMS.Backend.Repo.Interface;
using Microsoft.EntityFrameworkCore;

namespace LMS.Backend.Repo.Implement;

public class ClassworkRepository : BaseRepository<ClassworkTopic>, IClassworkRepository
{
    public ClassworkRepository(AppDbContext context) : base(context) { }

    public async Task<ClassworkTopic> CreateTopicAsync(ClassworkTopic topic)
    {
        await AddAsync(topic);
        await SaveChangesAsync();
        return topic;
    }

    public async Task<List<ClassworkTopic>> GetFullClassworkByCourseAsync(Guid courseId)
    {
        return await _context.ClassworkTopic
            .Include(t => t.Items)
                .ThenInclude(i => i.Resources)
            .Include(t => t.Items)
                .ThenInclude(i => i.Submissions)
            .Where(t => t.CourseId == courseId)
            .OrderByDescending(t => t.CreatedAt)
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<bool> TopicExistsAsync(Guid topicId)
    {
        return await _context.ClassworkTopic.AnyAsync(t => t.Id == topicId);
    }

    public async Task AddClassworkItemAsync(ClassworkItem item)
    {
        await _context.ClassworkItem.AddAsync(item);
        await SaveChangesAsync();
    }

    public async Task AddResourceAsync(ClassworkResource resource)
    {
        await _context.ClassworkResource.AddAsync(resource);
        await SaveChangesAsync();
    }

    public async Task<ClassworkSubmission?> GetSubmissionByUserAsync(Guid itemId, string userId)
    {
        return await _context.ClassworkSubmission
            .FirstOrDefaultAsync(s => s.ClassworkItemId == itemId && s.UserId == userId);
    }

    public async Task<ClassworkSubmission?> GetSubmissionByIdAsync(Guid submissionId)
    {
        return await _context.ClassworkSubmission.FindAsync(submissionId);
    }

    public async Task CreateSubmissionAsync(ClassworkSubmission submission)
    {
        await _context.ClassworkSubmission.AddAsync(submission);
        await SaveChangesAsync();
    }

    public async Task UpdateSubmissionAsync(ClassworkSubmission submission)
    {
        _context.ClassworkSubmission.Update(submission);
        await SaveChangesAsync();
    }

    public async Task<bool> DeleteTopicAsync(Guid topicId)
    {
        var topic = await GetByIdAsync(topicId);
        if (topic == null) return false;

        Delete(topic);
        await SaveChangesAsync();
        return true;
    }

    public async Task<ClassworkItem?> GetItemByIdAsync(Guid itemId)
    {
        return await _context.ClassworkItem
            .Include(i => i.Resources)
            .FirstOrDefaultAsync(i => i.Id == itemId);
    }

    // Get all submissions for an item (needed to delete student-uploaded files)
    public async Task<List<ClassworkSubmission>> GetSubmissionsByItemAsync(Guid itemId)
    {
        return await _context.ClassworkSubmission
            .Where(s => s.ClassworkItemId == itemId)
            .ToListAsync();
    }

    // Delete an item from the database
    public async Task<bool> DeleteItemAsync(Guid itemId)
    {
        var item = await _context.ClassworkItem.FindAsync(itemId);
        if (item == null) return false;

        _context.ClassworkItem.Remove(item);
        await SaveChangesAsync();
        return true;
    }

    // Helper for Topic deletion to include nested items for file cleanup logic
    public async Task<ClassworkTopic?> GetTopicWithItemsAsync(Guid topicId)
    {
        return await _context.ClassworkTopic
            .Include(t => t.Items)
                .ThenInclude(i => i.Resources)
            .FirstOrDefaultAsync(t => t.Id == topicId);
    }
}