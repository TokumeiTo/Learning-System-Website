using FluentValidation;
using LMS.Backend.DTOs.Library;

namespace LMS.Backend.Validators;

public class EBookRequestValidator : AbstractValidator<EBookRequestDto>
{
    public EBookRequestValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Book title is required.")
            .MaximumLength(255);

        RuleFor(x => x.Author)
            .NotEmpty().WithMessage("Author name is required.")
            .MaximumLength(150);

        RuleFor(x => x.Category)
            .NotEmpty().WithMessage("Category is required.")
            .MaximumLength(50);

        // 1. Validate the PDF File
        // If it's a NEW upload, EBookFile must be present.
        // If it's an UPDATE, FileUrl (the existing path) might be present instead.
        RuleFor(x => x)
            .Must(x => x.EBookFile != null || !string.IsNullOrEmpty(x.FileUrl))
            .WithMessage("A PDF file is required.");

        // 2. Validate the Thumbnail
        RuleFor(x => x)
            .Must(x => x.ThumbnailFile != null || !string.IsNullOrEmpty(x.ThumbnailUrl))
            .WithMessage("A cover image is required.");

        // 3. Optional: Validate File Extensions/Size
        RuleSet("Files", () => {
            RuleFor(x => x.EBookFile)
                .Must(file => file == null || file.ContentType == "application/pdf")
                .WithMessage("Only PDF files are allowed.");

            RuleFor(x => x.EBookFile)
                .Must(file => file == null || file.Length < 419_430_400)
                .WithMessage("File size must be less than 400MB.");
        });
    }
}