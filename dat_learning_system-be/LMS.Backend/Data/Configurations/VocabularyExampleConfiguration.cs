using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LMS.Backend.Data.Configurations;

public class VocabularyExampleConfiguration : IEntityTypeConfiguration<VocabularyExample>
{
    public void Configure(EntityTypeBuilder<VocabularyExample> builder)
    {
        builder.HasKey(ex => ex.Id);
        builder.Property(ex => ex.Japanese).IsRequired().HasMaxLength(500);
        builder.Property(ex => ex.English).IsRequired().HasMaxLength(500);
    }
}              