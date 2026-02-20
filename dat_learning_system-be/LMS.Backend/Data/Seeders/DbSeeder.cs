using LMS.Backend.Data.Entities;
using LMS.Backend.Common;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace LMS.Backend.Data.Seeders;

public static class DbSeeder
{
    public static void SeedOrgUnits(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<OrgUnit>().HasData(
            // --- DIVISIONS (Level 0) ---
            new OrgUnit { Id = 1, Name = "Management Division", Level = OrgLevel.Division, ParentId = null },
            new OrgUnit { Id = 8, Name = "System Development Division", Level = OrgLevel.Division, ParentId = null },
            new OrgUnit { Id = 11, Name = "Offshore Development Division", Level = OrgLevel.Division, ParentId = null },

            // --- DEPARTMENTS (Level 1) ---
            new OrgUnit { Id = 2, Name = "HR & Admin Dept", Level = OrgLevel.Department, ParentId = 1 },
            new OrgUnit { Id = 3, Name = "Finance Dept", Level = OrgLevel.Department, ParentId = 1 },
            new OrgUnit { Id = 4, Name = "PMO and Staff Development Dept", Level = OrgLevel.Department, ParentId = 1 },
            new OrgUnit { Id = 5, Name = "Auditor", Level = OrgLevel.Department, ParentId = 1 },
            new OrgUnit { Id = 9, Name = "Application Development Dept", Level = OrgLevel.Department, ParentId = 8 },
            new OrgUnit { Id = 10, Name = "Infrastructure Implementation and Operation Dept", Level = OrgLevel.Department, ParentId = 8 },
            new OrgUnit { Id = 12, Name = "Offshore Development Dept-1", Level = OrgLevel.Department, ParentId = 11 },
            new OrgUnit { Id = 13, Name = "Offshore Development Dept-2", Level = OrgLevel.Department, ParentId = 11 },

            // --- SECTIONS (Level 2) ---
            new OrgUnit { Id = 14, Name = "Common Infra Development Section", Level = OrgLevel.Section, ParentId = 10 },
            new OrgUnit { Id = 15, Name = "Local Infra Project Section", Level = OrgLevel.Section, ParentId = 10 },
            new OrgUnit { Id = 16, Name = "Section 1 (Offshore Dept-1)", Level = OrgLevel.Section, ParentId = 12 },
            new OrgUnit { Id = 17, Name = "Section 2 (Offshore Dept-1)", Level = OrgLevel.Section, ParentId = 12 },
            new OrgUnit { Id = 18, Name = "Section 3 (Offshore Dept-1)", Level = OrgLevel.Section, ParentId = 12 },
            new OrgUnit { Id = 19, Name = "Section 1 (Offshore Dept-2)", Level = OrgLevel.Section, ParentId = 13 },
            new OrgUnit { Id = 20, Name = "Section 2 (Offshore Dept-2)", Level = OrgLevel.Section, ParentId = 13 },

            // --- TEAMS (Level 3) ---
            new OrgUnit { Id = 6, Name = "HR & Payroll", Level = OrgLevel.Team, ParentId = 2 },
            new OrgUnit { Id = 7, Name = "Recruitment", Level = OrgLevel.Team, ParentId = 2 },
            new OrgUnit { Id = 21, Name = "Exchange System Team", Level = OrgLevel.Team, ParentId = 9 },
            new OrgUnit { Id = 22, Name = "Common Application Infrastructure Team", Level = OrgLevel.Team, ParentId = 9 },
            new OrgUnit { Id = 23, Name = "JICA BPO Team", Level = OrgLevel.Team, ParentId = 9 },
            new OrgUnit { Id = 24, Name = "MAJA JLPT System Development Team", Level = OrgLevel.Team, ParentId = 9 },
            new OrgUnit { Id = 25, Name = "Other Local System Team", Level = OrgLevel.Team, ParentId = 9 },
            new OrgUnit { Id = 26, Name = "System Team", Level = OrgLevel.Team, ParentId = 14 },
            new OrgUnit { Id = 27, Name = "Network Team", Level = OrgLevel.Team, ParentId = 14 },
            new OrgUnit { Id = 28, Name = "Service Desk Team", Level = OrgLevel.Team, ParentId = 14 },
            new OrgUnit { Id = 29, Name = "OMG Team", Level = OrgLevel.Team, ParentId = 14 },
            new OrgUnit { Id = 30, Name = "Local Project Team 1", Level = OrgLevel.Team, ParentId = 15 },
            new OrgUnit { Id = 31, Name = "Aeon Infra Team", Level = OrgLevel.Team, ParentId = 15 },
            new OrgUnit { Id = 33, Name = "Mark Team", Level = OrgLevel.Team, ParentId = 16 },
            new OrgUnit { Id = 34, Name = "SNR-MF Team", Level = OrgLevel.Team, ParentId = 16 },
            new OrgUnit { Id = 36, Name = "FPD Team", Level = OrgLevel.Team, ParentId = 17 },
            new OrgUnit { Id = 37, Name = "DBP Team", Level = OrgLevel.Team, ParentId = 17 },
            new OrgUnit { Id = 39, Name = "TDB, D-Base Team", Level = OrgLevel.Team, ParentId = 18 },
            new OrgUnit { Id = 40, Name = "CstNavi Team", Level = OrgLevel.Team, ParentId = 18 },
            new OrgUnit { Id = 41, Name = "Delta Team", Level = OrgLevel.Team, ParentId = 18 },
            new OrgUnit { Id = 42, Name = "OSS Team", Level = OrgLevel.Team, ParentId = 19 },
            new OrgUnit { Id = 43, Name = "MODOS Team", Level = OrgLevel.Team, ParentId = 19 },
            new OrgUnit { Id = 44, Name = "Block Chain Team", Level = OrgLevel.Team, ParentId = 19 },
            new OrgUnit { Id = 45, Name = "WB4 Team", Level = OrgLevel.Team, ParentId = 20 },
            new OrgUnit { Id = 46, Name = "SONAR-FR Team", Level = OrgLevel.Team, ParentId = 20 },
            new OrgUnit { Id = 47, Name = "FAIMS-IT Team", Level = OrgLevel.Team, ParentId = 20 },
            new OrgUnit { Id = 48, Name = "KOSMO-Network21 Team", Level = OrgLevel.Team, ParentId = 20 },
            new OrgUnit { Id = 49, Name = "WEB Team", Level = OrgLevel.Team, ParentId = 20 },
            new OrgUnit { Id = 50, Name = "KOSMO-NEXT Team", Level = OrgLevel.Team, ParentId = 20 },
            new OrgUnit { Id = 51, Name = "HIME Team", Level = OrgLevel.Team, ParentId = 20 },
            new OrgUnit { Id = 52, Name = "SoftPhone Team", Level = OrgLevel.Team, ParentId = 20 },
            new OrgUnit { Id = 55, Name = "Administration", Level = OrgLevel.Team, ParentId = 2 },
            new OrgUnit { Id = 56, Name = "Document Management", Level = OrgLevel.Team, ParentId = 2 },
            new OrgUnit { Id = 58, Name = "DMS Financial & Tax Accountant", Level = OrgLevel.Team, ParentId = 3 },
            new OrgUnit { Id = 60, Name = "Payroll and Project Accountant", Level = OrgLevel.Team, ParentId = 3 },
            new OrgUnit { Id = 61, Name = "Cash Management", Level = OrgLevel.Team, ParentId = 3 },
            new OrgUnit { Id = 62, Name = "Contract Management", Level = OrgLevel.Team, ParentId = 3 },
            new OrgUnit { Id = 63, Name = "Corporate Planning", Level = OrgLevel.Team, ParentId = 3 },
            new OrgUnit { Id = 64, Name = "Staff Development", Level = OrgLevel.Team, ParentId = 4 },
            new OrgUnit { Id = 65, Name = "PMO", Level = OrgLevel.Team, ParentId = 4 },
            new OrgUnit { Id = 66, Name = "Quality Control", Level = OrgLevel.Team, ParentId = 4 },
            new OrgUnit { Id = 67, Name = "Translator Team", Level = OrgLevel.Team, ParentId = 11 }
        );

        // --- SEED THE SUPER ADMIN ---
        var adminId = "b74ddd14-6340-4840-95c2-db12554843e5";
        var adminUser = new ApplicationUser
        {
            Id = adminId,
            UserName = "00-0000",
            NormalizedUserName = "00-0000",
            Email = "admin@lms.com",
            NormalizedEmail = "ADMIN@LMS.COM",
            EmailConfirmed = true,
            FullName = "Super Admin",
            CompanyCode = "00-0000",
            Position = Position.SuperAdmin,
            MustChangePassword = false,
            OrgUnitId = 1
        };

        var hasher = new PasswordHasher<ApplicationUser>();
        adminUser.PasswordHash = hasher.HashPassword(adminUser, "Admin@2026");

        modelBuilder.Entity<ApplicationUser>().HasData(adminUser);
    }
    public static void SeedRoles(ModelBuilder modelBuilder)
    {
        string superAdminRoleId = "r1";
        string staffRoleId = "r2";
        string adminRoleId = "r3";

        modelBuilder.Entity<IdentityRole>().HasData(
            new IdentityRole { Id = superAdminRoleId, Name = "SuperAdmin", NormalizedName = "SUPERADMIN" },
            new IdentityRole { Id = staffRoleId, Name = "Staff", NormalizedName = "STAFF" },
            new IdentityRole { Id = adminRoleId, Name = "Admin", NormalizedName = "ADMIN" }
        );

        modelBuilder.Entity<IdentityUserRole<string>>().HasData(new IdentityUserRole<string>
        {
            RoleId = adminRoleId,
            UserId = "b74ddd14-6340-4840-95c2-db12554843e5"
        });
    }
}