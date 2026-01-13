using Microsoft.AspNetCore.Identity;

namespace LMS.Backend.Data.Entities;

public class User : IdentityUser<int>
{
    public string FullName { get; set; } = null!;
    public ICollection<Role> Roles { get; set; } = new List<Role>();
}