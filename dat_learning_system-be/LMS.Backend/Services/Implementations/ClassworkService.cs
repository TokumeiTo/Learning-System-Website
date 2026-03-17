using AutoMapper;
using LMS.Backend.Data.Entities;
using LMS.Backend.DTOs.Classwork;
using LMS.Backend.Repo.Interface;
using LMS.Backend.Services.Interfaces;

namespace LMS.Backend.Services.Implement;

public class ClassworkService(
    IClassworkRepository repo,
    IMediaHandlerService mediaHandler,
    IFileService fileService,
    IUserRepository userRepository,
    IMapper mapper) : IClassworkService
{
    // --- TOPIC LOGIC ---
    public async Task<ClassworkTopicDto> AddTopicAsync(CreateClassworkTopicDto dto, string adminUserId)
    {
        var topic = new ClassworkTopic
        {
            Id = Guid.NewGuid(),
            CourseId = dto.CourseId,
            Title = dto.Title,
            CreatedBy = adminUserId,
            CreatedAt = DateTime.UtcNow,
            Items = new()
        };

        await repo.CreateTopicAsync(topic);
        return mapper.Map<ClassworkTopicDto>(topic, opt =>
        {
            opt.Items["CurrentUserId"] = adminUserId;
        });
    }

    // --- ITEM & RESOURCE LOGIC ---
    public async Task<ClassworkItemDto> AddClassworkItemAsync(CreateClassworkItemDto dto, string adminUserId)
    {
        if (!await repo.TopicExistsAsync(dto.TopicId))
            throw new Exception("Target Topic does not exist.");

        var item = mapper.Map<ClassworkItem>(dto);
        item.Id = Guid.NewGuid();
        item.CreatedBy = adminUserId;
        item.CreatedAt = DateTime.UtcNow;

        foreach (var resDto in dto.Resources)
        {
            string finalUrl = resDto.ResourceType == "File"
                ? await mediaHandler.HandleBase64MediaAsync(resDto.Body, "file")
                : resDto.Body;

            item.Resources.Add(new ClassworkResource
            {
                Id = Guid.NewGuid(),
                ClassworkItemId = item.Id,
                ResourceUrl = finalUrl,
                DisplayName = resDto.DisplayName,
                ResourceType = resDto.ResourceType,
                UploadedBy = adminUserId,
                UploadedAt = DateTime.UtcNow
            });
        }

        await repo.AddClassworkItemAsync(item);
        return mapper.Map<ClassworkItemDto>(item, opt =>
        {
            opt.Items["CurrentUserId"] = adminUserId;
        });
    }

    // --- SUBMISSION & GRADING LOGIC ---
    public async Task<ClassworkSubmissionDto> SubmitWorkAsync(SubmitClassworkDto dto, string userId)
    {
        var existing = await repo.GetSubmissionByUserAsync(dto.ClassworkItemId, userId);
        string fileUrl = await mediaHandler.HandleBase64MediaAsync(dto.Body, "file");

        if (existing != null)
        {
            // Delete the physical file previously uploaded
            fileService.DeleteFile(existing.FileUrl);

            existing.FileUrl = fileUrl;
            existing.FileName = dto.FileName;
            existing.UpdatedAt = DateTime.UtcNow;

            // Clear previous grade upon resubmission
            existing.Grade = null;
            existing.Feedback = null;

            await repo.UpdateSubmissionAsync(existing);
            return mapper.Map<ClassworkSubmissionDto>(existing);
        }
        else
        {
            var submission = new ClassworkSubmission
            {
                Id = Guid.NewGuid(),
                ClassworkItemId = dto.ClassworkItemId,
                UserId = userId,
                FileUrl = fileUrl,
                FileName = dto.FileName,
                SubmittedAt = DateTime.UtcNow
            };

            await repo.CreateSubmissionAsync(submission);
            return mapper.Map<ClassworkSubmissionDto>(submission);
        }
    }

    public async Task<ClassworkSubmissionDto> GradeSubmissionAsync(Guid submissionId, double grade, string? feedback)
    {
        var submission = await repo.GetSubmissionByIdAsync(submissionId)
                         ?? throw new KeyNotFoundException("Submission not found.");

        submission.Grade = grade;
        submission.Feedback = feedback;

        await repo.UpdateSubmissionAsync(submission);
        return mapper.Map<ClassworkSubmissionDto>(submission);
    }

    public async Task<List<ClassworkTopicDto>> GetCourseClassworkAsync(Guid courseId, string? userId = null, bool isEditMode = false)
    {
        var data = await repo.GetFullClassworkByCourseAsync(courseId);
        var dtos = mapper.Map<List<ClassworkTopicDto>>(data, opt =>
        {
            if (!string.IsNullOrEmpty(userId)) opt.Items["CurrentUserId"] = userId;
        });

        var now = DateTime.UtcNow;
        var allItems = dtos.SelectMany(t => t.Items).ToList();

        // 1. Collect all Unique User IDs (Creators + Students if Admin)
        var userIdsToFetch = allItems.Select(i => i.CreatedBy).Distinct().ToList();

        if (isEditMode)
        {
            // Add student IDs from submissions to the fetch list
            var allSubmissionsForItems = new Dictionary<Guid, List<ClassworkSubmission>>();
            foreach (var itemDto in allItems)
            {
                var subs = await repo.GetSubmissionsByItemAsync(itemDto.Id);
                allSubmissionsForItems[itemDto.Id] = subs;
                userIdsToFetch.AddRange(subs.Select(s => s.UserId));
            }
            userIdsToFetch = userIdsToFetch.Distinct().ToList();

            // 2. Bulk Fetch Users from DB (1 Query instead of N queries)
            var usersMap = (await userRepository.GetUsersByIdsAsync(userIdsToFetch))
                            .ToDictionary(u => u.Id, u => u.FullName);

            // 3. Assign Names from the Map
            foreach (var itemDto in allItems)
            {
                itemDto.CreatedByName = usersMap.GetValueOrDefault(itemDto.CreatedBy) ?? "Unknown User";

                if (isEditMode && allSubmissionsForItems.TryGetValue(itemDto.Id, out var submissions))
                {
                    itemDto.AllSubmissions = submissions.Select(sub =>
                    {
                        var subDto = mapper.Map<AdminSubmissionViewDto>(sub);
                        subDto.StudentName = usersMap.GetValueOrDefault(sub.UserId) ?? "Unknown Student";

                        return subDto;
                    }).ToList();
                }
            }
        }
        else
        {
            // Simple path for students
            foreach (var itemDto in allItems)
            {
                var creator = await userRepository.GetByIdAsync(itemDto.CreatedBy);
                itemDto.CreatedByName = creator?.FullName ?? "Unknown User";

                // Student Auto-Fail Logic
                if (!string.IsNullOrEmpty(userId) && itemDto.ItemType == "Assignment")
                {
                    if (itemDto.DueDate.HasValue && now > itemDto.DueDate.Value && itemDto.MySubmission == null)
                    {
                        itemDto.MySubmission = new ClassworkSubmissionDto
                        {
                            Grade = 0,
                            Feedback = "System: Failed to submit before deadline. Automatic F grade assigned.",
                            FileName = "N/A",
                            SubmittedAt = itemDto.DueDate.Value
                        };
                    }
                }
            }
        }

        return dtos;
    }

    public async Task<bool> RemoveTopicAsync(Guid topicId)
    {
        // 1. Get full topic data for file cleanup
        var topic = await repo.GetTopicWithItemsAsync(topicId);
        if (topic == null) return false;

        // 2. Loop through all items and their files/submissions
        foreach (var item in topic.Items)
        {
            await CleanupItemFilesAsync(item.Id);
        }

        // 3. Delete the topic (EF handles cascading the DB rows if configured, 
        // but repo.DeleteTopicAsync handles the DB removal)
        return await repo.DeleteTopicAsync(topicId);
    }

    public async Task<bool> RemoveItemAsync(Guid itemId)
    {
        // 1. Clean up physical files first
        await CleanupItemFilesAsync(itemId);

        // 2. Delete the DB record
        return await repo.DeleteItemAsync(itemId);
    }

    private async Task CleanupItemFilesAsync(Guid itemId)
    {
        // Delete item resources (Files)
        var item = await repo.GetItemByIdAsync(itemId);
        if (item != null)
        {
            foreach (var res in item.Resources.Where(r => r.ResourceType == "File"))
            {
                fileService.DeleteFile(res.ResourceUrl);
            }
        }

        // Delete student submissions (Files)
        var submissions = await repo.GetSubmissionsByItemAsync(itemId);
        foreach (var sub in submissions)
        {
            fileService.DeleteFile(sub.FileUrl);
        }
    }

    private string MapScoreToLetterGrade(double? score)
    {
        if (score == null) return "N/A";
        return score switch
        {
            >= 90 => "A",
            >= 80 => "B",
            >= 70 => "C",
            >= 60 => "D",
            >= 50 => "E",
            >= 40 => "E-",
            _ => "F" // Anything below 60 is a Fail
        };
    }
}