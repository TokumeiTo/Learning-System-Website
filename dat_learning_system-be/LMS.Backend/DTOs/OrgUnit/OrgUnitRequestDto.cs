namespace LMS.Backend.DTOs.OrgUnit;

public class OrgUnitRequestDto
{
    public string Name { get; set; } = string.Empty;
    public int Level { get; set; }
    public int? ParentId { get; set; }
}