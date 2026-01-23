using FluentValidation;
using LMS.Backend.DTOs.Auth;

namespace LMS.Backend.Validators;

public class RegisterRequestValidator : AbstractValidator<RegisterRequestDto>
{
    public RegisterRequestValidator()
    {
        RuleFor(x => x.FullName)
            .NotEmpty().WithMessage("Full Name is required")
            .MaximumLength(100);

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required")
            .EmailAddress().WithMessage("Invalid email format");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Password is required")
            .MinimumLength(6).WithMessage("Password must be at least 6 characters");

        RuleFor(x => x.CompanyCode)
            .NotEmpty().WithMessage("Company Code is required");

        RuleFor(x => x.Position)
            .NotEmpty().WithMessage("Position is required");
    }
}
