using FluentValidation;
using LMS.Backend.DTOs.Flashcard;
namespace LMS.Backend.Validators;

public class GrammarValidator : AbstractValidator<GrammarCreateUpdateDto>
{
    public GrammarValidator()
    {
        RuleFor(x => x.Title).NotEmpty().MaximumLength(200);
        RuleFor(x => x.JlptLevel).NotEmpty().Matches(@"^N[1-5]$").WithMessage("Must be N1-N5");
        RuleFor(x => x.Meaning).NotEmpty();
        RuleFor(x => x.Structure).NotEmpty();
        RuleFor(x => x.Explanation).NotEmpty();
        
        // Validate the list of examples too!
        RuleForEach(x => x.Examples).SetValidator(new GrammarExampleValidator());
    }
}

public class GrammarExampleValidator : AbstractValidator<GrammarExampleDto>
{
    public GrammarExampleValidator()
    {
        RuleFor(x => x.Jp).NotEmpty().WithMessage("Japanese sentence is required");
        RuleFor(x => x.En).NotEmpty().WithMessage("English translation is required");
    }
}