using LMS.Backend.Data.Entities;
using LMS.Backend.Common;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace LMS.Backend.Data.Seeders;

public static class DbSeeder
{
    public static void SeedOrgUnits(ModelBuilder modelBuilder)
    {
        // 1. Create the Management Division
        modelBuilder.Entity<OrgUnit>().HasData(
            new OrgUnit { Id = 1, Name = "Management Division", Level = OrgLevel.Division, ParentId = null }
        );

        // 2. Create Departments under Management
        modelBuilder.Entity<OrgUnit>().HasData(
            new OrgUnit { Id = 2, Name = "HR & Admin", Level = OrgLevel.Department, ParentId = 1 },
            new OrgUnit { Id = 3, Name = "Finance Dept", Level = OrgLevel.Department, ParentId = 1 },
            new OrgUnit { Id = 4, Name = "PMO and Staff Development", Level = OrgLevel.Department, ParentId = 1 },
            new OrgUnit { Id = 5, Name = "Auditor", Level = OrgLevel.Department, ParentId = 1 }
        );

        // 3. Create Sections under HR
        modelBuilder.Entity<OrgUnit>().HasData(
            new OrgUnit { Id = 6, Name = "HR & Payroll", Level = OrgLevel.Section, ParentId = 2 },
            new OrgUnit { Id = 7, Name = "Recruitment", Level = OrgLevel.Section, ParentId = 2 }
        );

        // 4. SEED THE SUPER ADMIN
        var adminId = "b74ddd14-6340-4840-95c2-db12554843e5"; // Use a fixed GUID string
        var adminUser = new ApplicationUser
        {
            Id = adminId,
            UserName = "00-0000",
            NormalizedUserName = "00-0000", // Important for Identity lookups
            Email = "admin@lms.com",
            NormalizedEmail = "ADMIN@LMS.COM",
            EmailConfirmed = true,
            FullName = "Super Admin",
            CompanyCode = "00-0000",
            Position = Position.SuperAdmin,
            MustChangePassword = false, // Admin doesn't need to change it immediately
            OrgUnitId = 1 // Linked to Management Division
        };

        // Hash the password
        var hasher = new PasswordHasher<ApplicationUser>();
        adminUser.PasswordHash = hasher.HashPassword(adminUser, "Admin@2026");

        modelBuilder.Entity<ApplicationUser>().HasData(adminUser);
    }
    public static void SeedRoles(ModelBuilder modelBuilder)
    {
        string adminRoleId = "r1";
        string staffRoleId = "r2";
        string hrRoleId = "r3";

        modelBuilder.Entity<IdentityRole>().HasData(
            new IdentityRole { Id = adminRoleId, Name = "SuperAdmin", NormalizedName = "SUPERADMIN" },
            new IdentityRole { Id = staffRoleId, Name = "Staff", NormalizedName = "STAFF" },
            new IdentityRole { Id = hrRoleId, Name = "HR", NormalizedName = "HR" }
        );

        modelBuilder.Entity<IdentityUserRole<string>>().HasData(new IdentityUserRole<string>
        {
            RoleId = adminRoleId,
            UserId = "b74ddd14-6340-4840-95c2-db12554843e5"
        });
    }
}