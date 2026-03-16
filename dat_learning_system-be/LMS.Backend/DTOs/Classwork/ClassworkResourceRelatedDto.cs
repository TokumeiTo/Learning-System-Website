namespace LMS.Backend.DTOs.Classwork;

public class CreateClassworkResourceDto
{
    // This could be a Base64 string for a file or a raw URL for a link
    public string Body { get; set; } = string.Empty; 
    public string DisplayName { get; set; } = string.Empty;
    public string ResourceType { get; set; } = "File"; // "File" or "Link"
}

public class ClassworkResourceDto
{
    public Guid Id { get; set; }
    public string ResourceUrl { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
    public string ResourceType { get; set; } = string.Empty;
}