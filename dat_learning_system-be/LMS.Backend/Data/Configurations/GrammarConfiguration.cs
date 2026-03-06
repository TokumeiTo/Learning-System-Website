using LMS.Backend.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LMS.Backend.Data.Configurations;

public class GrammarConfiguration : IEntityTypeConfiguration<Grammar>
{
    public void Configure(EntityTypeBuilder<Grammar> builder)
    {
        builder.HasKey(g => g.Id);

        builder.Property(g => g.Title)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(g => g.JlptLevel)
            .IsRequired()
            .HasMaxLength(2); // N1, N2, etc.

        builder.Property(g => g.Meaning)
            .IsRequired();

        builder.Property(g => g.Structure)
            .IsRequired();

        // One-to-Many Relationship
        builder.HasMany(g => g.Examples)
            .WithOne()
            .HasForeignKey(e => e.GrammarId)
            .OnDelete(DeleteBehavior.Cascade); // Delete grammar = delete its examples
    }
}