using FluentValidation;
using LMS.Backend.DTOs.Auth;

namespace LMS.Backend.Validators;

public class LoginRequestValidator : AbstractValidator<LoginRequestDto>
{
    public LoginRequestValidator()
    {
        RuleFor(x => x.CompanyCode)
            .NotEmpty().WithMessage("Company Code is required")
            .MaximumLength(50).WithMessage("Company Code must be at most 50 characters");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Password is required")
            .MinimumLength(6).WithMessage("Password must be at least 6 characters");
    }
}
