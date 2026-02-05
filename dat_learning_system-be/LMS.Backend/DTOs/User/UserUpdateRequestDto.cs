namespace LMS.Backend.DTOs.User;

public class UserUpdateRequestDto
{
    public string FullName { get; set; } = string.Empty;
    public string Position { get; set; } = string.Empty;
    public int? OrgUnitId { get; set; }
    // Add "Reason", audit log requires a manual note from the admin
    public string UpdatedReason { get; set; } = string.Empty; 
}