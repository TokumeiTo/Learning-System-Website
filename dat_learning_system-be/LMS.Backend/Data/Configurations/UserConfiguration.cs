using LMS.Backend.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LMS.Backend.Data.Configurations;

public class UserConfiguration : IEntityTypeConfiguration<ApplicationUser>
{
    public virtual void Configure(EntityTypeBuilder<ApplicationUser> builder)
    {
        builder.Property(u => u.FullName).IsRequired().HasMaxLength(150);
        builder.Property(u => u.CompanyCode).IsRequired().HasMaxLength(20);

        builder.HasIndex(u => u.CompanyCode).IsUnique();

        builder.HasOne(u => u.OrgUnit)
            .WithMany(o => o.Users)
            .HasForeignKey(u => u.OrgUnitId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}