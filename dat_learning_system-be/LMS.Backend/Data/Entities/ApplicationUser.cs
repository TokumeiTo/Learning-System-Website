using LMS.Backend.Common;
using Microsoft.AspNetCore.Identity;

namespace LMS.Backend.Data.Entities;

public class ApplicationUser : IdentityUser
{
    public string FullName { get; set; } = null!;
    public string CompanyCode { get; set; } = null!;
    public Position Position { get; set; }
    public bool MustChangePassword { get; set; } = true;

    // Hierarchy Link 
    public int? OrgUnitId { get; set; }
    public virtual OrgUnit? OrgUnit { get; set; }
}