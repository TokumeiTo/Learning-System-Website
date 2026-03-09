using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LMS.Backend.Data.Configurations;

public class VocabularyConfiguration : IEntityTypeConfiguration<Vocabulary>
{
    public void Configure(EntityTypeBuilder<Vocabulary> builder)
    {
        builder.HasKey(v => v.Id);
        
        builder.Property(v => v.Word).IsRequired().HasMaxLength(100);
        builder.Property(v => v.Reading).IsRequired().HasMaxLength(100);
        builder.Property(v => v.Meaning).IsRequired().HasMaxLength(500);
        builder.Property(v => v.PartOfSpeech).IsRequired().HasMaxLength(50);
        builder.Property(v => v.JLPTLevel).IsRequired().HasMaxLength(10);
        
        // One-to-Many Relationship: One Vocabulary has Many Examples
        builder.HasMany(v => v.Examples)
               .WithOne()
               .HasForeignKey(ex => ex.VocabularyId)
               .OnDelete(DeleteBehavior.Cascade); // Delete word -> Delete examples
    }
}