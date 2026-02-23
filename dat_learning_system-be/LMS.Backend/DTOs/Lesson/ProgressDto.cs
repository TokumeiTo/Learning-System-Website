namespace LMS.Backend.DTOs.Lesson;

public record ProgressRequestDto(Guid LessonId, int Seconds);

public record LessonProgressDto(
    Guid LessonId,
    int TimeSpentSeconds, 
    bool IsCompleted, 
    DateTime LastAccessedAt
);