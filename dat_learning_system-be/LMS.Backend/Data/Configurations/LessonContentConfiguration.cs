// Data/Configurations/LessonContentConfiguration.cs
using LMS.Backend.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LMS.Backend.Data.Configurations;

public class LessonContentConfiguration : IEntityTypeConfiguration<LessonContent>
{
    public void Configure(EntityTypeBuilder<LessonContent> builder)
    {
        builder.HasKey(c => c.Id);

        builder.Property(c => c.ContentType).IsRequired().HasMaxLength(50);
        
        builder.Property(c => c.Body).IsRequired().HasColumnType("text");

        // Index for performance when rendering the "Free Will" sequence
        builder.HasIndex(c => c.SortOrder);
    }
}