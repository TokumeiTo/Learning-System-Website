using Microsoft.AspNetCore.Identity;

namespace LMS.Backend.Data.Entities;

public class Role : IdentityRole<int>
{
    public ICollection<User> Users { get; set; } = new List<User>();
}