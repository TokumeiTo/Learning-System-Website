namespace LMS.Backend.DTOs.Classroom
{
    public class CourseStudentDto
    {
        public string UserId { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string CompanyCode { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public int ProgressPercentage { get; set; }
        public bool IsCompleted { get; set; }
        public DateTime? ApprovedAt { get; set; }
    }
}