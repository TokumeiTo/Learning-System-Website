namespace LMS.Backend.Services.Interfaces;

public interface ICourseRatingService
{
    Task<bool> SubmitRatingAsync(Guid courseId, string userId, int score, string? comment);
}