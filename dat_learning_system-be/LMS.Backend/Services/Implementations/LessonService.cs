using System.Text.Json;
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
    IFileService fileService,
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
        // 1. Fetch course structure
        var course = await repo.GetClassroomStructureAsync(courseId);
        if (course == null) return null;

        // 2. Map to DTO
        var viewDto = mapper.Map<ClassroomViewDto>(course, opt => opt.Items["IsAdmin"] = isAdmin);

        // 3. Shuffle Options & Hide Answers for Students
        foreach (var lessonDto in viewDto.Lessons)
        {
            var testContents = lessonDto.Contents
                .Where(c => c.ContentType == "test" && c.Test != null);

            foreach (var content in testContents)
            {
                foreach (var question in content.Test!.Questions)
                {
                    // Randomize for student variety
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

        // 4. Progress, Scoring & Locking Logic
        var userProgress = await progressRepo.GetUserProgressForCourseAsync(userId, courseId);
        bool previousCompleted = true;

        foreach (var lessonDto in viewDto.Lessons)
        {
            // A. Set Completion Status
            var progress = userProgress.FirstOrDefault(p => p.LessonId == lessonDto.Id);
            lessonDto.IsDone = progress?.IsCompleted ?? false;

            // B. Get Best Score for this User (from the included Attempts)
            var lessonEntity = course.Lessons.FirstOrDefault(l => l.Id == lessonDto.Id);
            if (lessonEntity != null)
            {
                var bestAttempt = lessonEntity.Attempts
                    .Where(a => a.UserId == userId)
                    .OrderByDescending(a => a.Percentage)
                    .FirstOrDefault();

                lessonDto.LastScore = bestAttempt?.Percentage;
            }

            // C. Handle Locking
            lessonDto.IsLocked = !previousCompleted;

            // The next lesson is unlocked if the current one is done
            previousCompleted = lessonDto.IsDone;
        }

        return viewDto;
    }

    public async Task BulkSaveContentsAsync(SaveLessonContentsDto dto)
    {
        foreach (var itemDto in dto.Contents)
        {
            if (itemDto.ContentType == "image" || itemDto.ContentType == "video" || itemDto.ContentType == "file")
            {
                if (!string.IsNullOrEmpty(itemDto.Body))
                {
                    // The handler will check if it's JSON, Base64, or already a URL
                    itemDto.Body = await HandleBase64MediaAsync(itemDto.Body, itemDto.ContentType);
                }
            }
        }
        // 1. Map everything
        var contents = mapper.Map<List<LessonContent>>(dto.Contents);

        // 2. Save the primary content list first to generate IDs for new items
        // This is the "Manual Sync" step in your repository
        await repo.SaveLessonContentsAsync(dto.LessonId, contents);

        // 3. Iterate through the DTOs using a loop to maintain the relationship
        for (int i = 0; i < dto.Contents.Count; i++)
        {
            var itemDto = dto.Contents[i];

            // Only proceed if it's a test
            if (itemDto.ContentType == "test" && itemDto.Test != null)
            {
                // Get the ID from the saved entity at the same position
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


    // Helper services
    private async Task<string> HandleBase64MediaAsync(string body, string contentType)
    {
        // 1. If it's already a URL, don't process it, just return as is.
        if (string.IsNullOrEmpty(body) || body.StartsWith("/uploads/")) return body;

        string base64Data = string.Empty;
        string fileName = string.Empty;

        try
        {
            // 2. Determine if the body is a JSON object or raw Base64
            if (body.Trim().StartsWith("{"))
            {
                var mediaData = JsonSerializer.Deserialize<MediaUploadJson>(body, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                base64Data = mediaData?.Data ?? string.Empty;
                fileName = mediaData?.Name ?? "upload";
            }
            else
            {
                base64Data = body;
                fileName = $"upload_{Guid.NewGuid()}"; // Fallback for raw Base64
            }

            // 3. Validate that we actually have Base64 data
            if (!base64Data.StartsWith("data:"))
            {
                return body; // Not Base64, return original string to avoid data loss
            }

            // 4. Extract metadata and bytes
            // Format: data:image/png;base64,iVBOR...
            var parts = base64Data.Split(',');
            if (parts.Length < 2) return body;

            string metadata = parts[0];
            string base64Content = parts[1];
            byte[] bytes = Convert.FromBase64String(base64Content);

            // 5. Extract MimeType and Extension
            // e.g., "data:image/png;base64" -> "image/png" -> "png"
            string mimeType = metadata.Split(':')[1].Split(';')[0];
            string extension = mimeType switch
            {
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" => "xlsx",
                "application/vnd.ms-excel" => "xls",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document" => "docx",
                "application/msword" => "doc",
                "application/pdf" => "pdf",
                "text/csv" => "csv",
                _ => mimeType.Contains("/") ? mimeType.Split('/')[1] : "bin"
            };

            if (!Path.HasExtension(fileName))
            {
                fileName = $"{fileName}.{extension}";
            }

            // 2. Dynamic Folder Routing
            string folderName = contentType switch
            {
                "image" => "images",
                "video" => "videos",
                "file" => "documents", // New folder for PDFs/Excel/Word
                _ => "others"
            };

            // 7. Wrap in FormFile and save via LocalFileService
            using var stream = new MemoryStream(bytes);
            var formFile = new FormFile(stream, 0, bytes.Length, "file", fileName)
            {
                Headers = new HeaderDictionary(),
                ContentType = mimeType
            };

            // This returns the final path: /uploads/images/filename(1).png
            return await fileService.UploadFileAsync(formFile, folderName);
        }
        catch (Exception)
        {
            // If parsing fails, return the original body so the DB doesn't end up null
            return body;
        }
    }
    private class MediaUploadJson
    {
        public string Data { get; set; } = string.Empty;
        public string? Name { get; set; }
    }
}