using LMS.Backend.Data.Entities;
using LMS.Backend.Data.Seeders;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace LMS.Backend.Data.Dbcontext;

public class AppDbContext : IdentityDbContext<ApplicationUser>
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<OrgUnit> OrgUnits { get; set; }
    public DbSet<Course> Courses { get; set; }
    public DbSet<Lesson> Lessons { get; set; }
    public DbSet<LessonContent> LessonContents { get; set; }
    public DbSet<AuditLog> AuditLogs { get; set; }
    public DbSet<Topic> Topics { get; set; }
    public DbSet<Assignment> Assignments { get; set; }
    public DbSet<Submission> Submissions { get; set; }
    public DbSet<Enrollment> Enrollments { get; set; }
    public DbSet<Notification> Notifications { get; set; }
    public DbSet<CourseRating> CourseRatings { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        // Must call base for Identity tables to be created
        base.OnModelCreating(builder);

        // 1. Configure OrgUnit Hierarchy (Self-Reference)
        builder.Entity<OrgUnit>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);

            // One Parent -> Many Children
            entity.HasOne(d => d.Parent)
                .WithMany(p => p.Children)
                .HasForeignKey(d => d.ParentId)
                .OnDelete(DeleteBehavior.Restrict); // Prevent accidental cascading deletes
        });

        // 2. Configure ApplicationUser mapping to OrgUnit
        builder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);

        // 3. Seed initial management data
        DbSeeder.SeedOrgUnits(builder);
        DbSeeder.SeedRoles(builder);
    }
}