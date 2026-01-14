using LMS.Backend.Common;

namespace LMS.Backend.Data.Entities;

public class OrgUnit
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    
    // This helps us distinguish between a "Division" and a "Section"
    public OrgLevel Level { get; set; } 

    // Self-reference: Every Dept has a Division as a Parent
    public int? ParentId { get; set; }
    public virtual OrgUnit? Parent { get; set; }
    public virtual ICollection<OrgUnit> Children { get; set; } = new List<OrgUnit>();

    // Users belonging to this specific unit
    public virtual ICollection<ApplicationUser> Users { get; set; } = new List<ApplicationUser>();
}

