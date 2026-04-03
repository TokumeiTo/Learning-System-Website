using FluentValidation;
using LMS.Backend.DTOs.Test_Quest;

namespace LMS.Backend.Validators;

public class TestValidator : AbstractValidator<TestDto>
{
    public TestValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Test title is required")
            .MaximumLength(200).WithMessage("Title cannot exceed 200 characters");

        RuleFor(x => x.PassingGrade)
            .InclusiveBetween(1, 100).WithMessage("Passing grade must be between 1 and 100%");

        RuleFor(x => x.JlptLevel)
            .NotEmpty().When(x => x.IsGlobal) // Global quizzes MUST have a level
            .Matches(@"^N[1-5]$").WithMessage("Level must be N1, N2, N3, N4, or N5");

        RuleFor(x => x.Category)
            .NotEmpty().When(x => x.IsGlobal)
            .WithMessage("Category is required for global quizzes");

        // Validate the list of Questions
        RuleFor(x => x.Questions)
            .NotEmpty().WithMessage("A test must have at least one question");

        RuleForEach(x => x.Questions).SetValidator(new QuestionValidator());
    }
}

public class QuestionValidator : AbstractValidator<QuestionDto>
{
    public QuestionValidator()
    {
        RuleFor(x => x.QuestionText)
            .NotEmpty().WithMessage("Question text cannot be empty");

        RuleFor(x => x.Points)
            .GreaterThan(0).WithMessage("Question must be worth at least 1 point");

        RuleFor(x => x.Type)
            .NotEmpty().WithMessage("Question type is required");

        // Validate the list of Options
        RuleFor(x => x.Options)
            .Must(o => o != null && o.Count >= 2)
            .WithMessage("Each question needs at least 2 options");

        RuleFor(x => x.Options)
            .Must(o => o != null && o.Any(opt => opt.IsCorrect))
            .WithMessage("Each question must have exactly one correct answer");

        RuleForEach(x => x.Options).SetValidator(new OptionValidator());
    }
}

public class OptionValidator : AbstractValidator<OptionDto>
{
    public OptionValidator()
    {
        RuleFor(x => x.OptionText)
            .NotEmpty().WithMessage("Option text is required");
    }
}