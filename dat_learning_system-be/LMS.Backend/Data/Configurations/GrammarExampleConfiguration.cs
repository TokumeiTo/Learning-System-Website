// Data/Configurations/GrammarExampleConfiguration.cs
using LMS.Backend.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class GrammarExampleConfiguration : IEntityTypeConfiguration<GrammarExample>
{
    public void Configure(EntityTypeBuilder<GrammarExample> builder)
    {
        builder.HasKey(e => e.Id);

        builder.Property(e => e.Jp)
            .IsRequired()
            .HasMaxLength(500); // Japanese sentences can be long

        builder.Property(e => e.Romaji)
            .HasMaxLength(500);

        builder.Property(e => e.En)
            .IsRequired()
            .HasMaxLength(1000);
    }
}