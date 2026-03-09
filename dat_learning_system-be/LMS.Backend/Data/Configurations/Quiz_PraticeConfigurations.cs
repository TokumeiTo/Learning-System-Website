using LMS.Backend.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LMS.Backend.Data.Configurations;

public class QuizTemplateConfiguration : IEntityTypeConfiguration<QuizTemplate>
{
    public void Configure(EntityTypeBuilder<QuizTemplate> builder)
    {
        builder.HasKey(t => t.Id);
        builder.Property(t => t.Title).IsRequired().HasMaxLength(200);

        builder.Property(t => t.Level).HasConversion<string>();
        builder.Property(t => t.SourceType).HasConversion<string>();

        builder.HasMany(t => t.Sessions)
               .WithOne(s => s.Template)
               .HasForeignKey(s => s.QuizTemplateId)
               .OnDelete(DeleteBehavior.Cascade);
    }
}

public class QuizSessionAnswerConfiguration : IEntityTypeConfiguration<QuizSessionAnswer>
{
    public void Configure(EntityTypeBuilder<QuizSessionAnswer> builder)
    {
        builder.HasKey(a => a.Id);
        
        // Index the SourceId for faster performance during the "Review" phase
        builder.HasIndex(a => a.SourceId);

        builder.Property(a => a.UserAnswer).IsRequired();
    }
}