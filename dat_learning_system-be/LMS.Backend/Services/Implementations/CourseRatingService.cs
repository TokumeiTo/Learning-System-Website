using AutoMapper;
using LMS.Backend.Common;
using LMS.Backend.Data.Entities;
using LMS.Backend.DTOs.Course;
using LMS.Backend.Repo.Interface;
using LMS.Backend.Services.Interfaces;

namespace LMS.Backend.Services.Implement;

public class CourseRatingService : ICourseRatingService
{
    private readonly ICourseRatingRepository _ratingRepo;
    private readonly ICourseRepository _courseRepo;
    private readonly IEnrollmentRepository _enrollmentRepo;

    public CourseRatingService(
        ICourseRatingRepository ratingRepo,
        ICourseRepository courseRepo,
        IEnrollmentRepository enrollmentRepo)
    {
        _ratingRepo = ratingRepo;
        _courseRepo = courseRepo;
        _enrollmentRepo = enrollmentRepo;
    }

    public async Task<bool> SubmitRatingAsync(Guid courseId, string userId, int score, string? comment)
    {
        // 1. Guard: Only Approved students can rate (Prevents "Inspect Element" bypass)
        var enrollment = await _enrollmentRepo.GetUserEnrollmentAsync(courseId, userId);
        if (enrollment == null || enrollment.Status != "Approved")
        {
            throw new UnauthorizedAccessException("You must be enrolled and approved to rate this course.");
        }

        // 2. Logic: Upsert (Update if exists, Create if new)
        var existingRating = await _ratingRepo.GetUserRatingAsync(courseId, userId);

        if (existingRating != null)
        {
            existingRating.Score = score;
            existingRating.Comment = comment;

            // Sync call because it only updates the ChangeTracker
            _ratingRepo.Update(existingRating);
        }
        else
        {
            await _ratingRepo.AddAsync(new CourseRating
            {
                Id = Guid.NewGuid(),
                CourseId = courseId,
                UserId = userId,
                Score = score,
                Comment = comment,
                CreatedAt = DateTime.UtcNow
            });
        }

        // 3. Save the "Source of Truth"
        await _ratingRepo.SaveChangesAsync();

        // 4. Sync: Recalculate and update the Course Cache
        var (average, count) = await _ratingRepo.GetCourseRatingStatsAsync(courseId);

        // We use our specialized repo method to update ONLY the cache columns
        await _courseRepo.UpdateRatingCacheAsync(courseId, average, count);

        return await _courseRepo.SaveChangesAsync();
    }
}