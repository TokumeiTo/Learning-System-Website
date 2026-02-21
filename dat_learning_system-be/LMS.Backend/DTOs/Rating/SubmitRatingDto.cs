namespace LMS.Backend.DTOs.Rating;

public class SubmitRatingDto
{
    public int Score { get; set; } // 1 to 5
    public string? Comment { get; set; }
}