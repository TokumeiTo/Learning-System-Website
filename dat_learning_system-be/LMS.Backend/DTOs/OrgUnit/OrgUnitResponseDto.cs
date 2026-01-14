namespace LMS.Backend.DTOs.OrgUnit;

public class OrgUnitResponseDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int Level { get; set; }
    public int? ParentId { get; set; }
    // Only include children as DTOs to maintain the tree structure
    public List<OrgUnitResponseDto> Children { get; set; } = new();
}