using LMS.Backend.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LMS.Backend.Data.Configurations;

public class ClassworkTopicConfiguration : IEntityTypeConfiguration<ClassworkTopic>
{
    public void Configure(EntityTypeBuilder<ClassworkTopic> builder)
    {
        builder.ToTable("ClassworkTopics");
        builder.HasKey(x => x.Id);
        
        builder.HasMany(x => x.Items)
            .WithOne()
            .HasForeignKey(x => x.TopicId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}

public class ClassworkItemConfiguration : IEntityTypeConfiguration<ClassworkItem>
{
    public void Configure(EntityTypeBuilder<ClassworkItem> builder)
    {
        builder.ToTable("ClassworkItems");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Title)
            .IsRequired()
            .HasMaxLength(255);

        builder.Property(x => x.ItemType)
            .IsRequired()
            .HasDefaultValue("Resource");

        // Relationship: Item -> Resources (Cascade)
        builder.HasMany(x => x.Resources)
            .WithOne()
            .HasForeignKey(x => x.ClassworkItemId)
            .OnDelete(DeleteBehavior.Cascade);

        // Relationship: Item -> Submissions (Cascade)
        builder.HasMany(x => x.Submissions)
            .WithOne()
            .HasForeignKey(x => x.ClassworkItemId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(x => x.CreatedAt);
    }
}

public class ClassworkResourceConfiguration : IEntityTypeConfiguration<ClassworkResource>
{
    public void Configure(EntityTypeBuilder<ClassworkResource> builder)
    {
        builder.ToTable("ClassworkResources");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.ResourceUrl)
            .IsRequired();

        builder.Property(x => x.DisplayName)
            .IsRequired()
            .HasMaxLength(255);

        builder.Property(x => x.ResourceType)
            .HasDefaultValue("File");
    }
}

public class ClassworkSubmissionConfiguration : IEntityTypeConfiguration<ClassworkSubmission>
{
    public void Configure(EntityTypeBuilder<ClassworkSubmission> builder)
    {
        builder.ToTable("ClassworkSubmissions");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.FileUrl)
            .IsRequired();

        builder.Property(x => x.UserId)
            .IsRequired();

        // Indexing for faster teacher lookups
        builder.HasIndex(x => x.UserId);
        builder.HasIndex(x => x.ClassworkItemId);
        
        // Ensure one student can only have one submission record per item
        // This supports your "Overwrite" logic at the DB level
        builder.HasIndex(x => new { x.ClassworkItemId, x.UserId }).IsUnique();
    }
}