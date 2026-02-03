using FluentValidation;
using LMS.Backend.DTOs.Enrollment;

namespace LMS.Backend.Validators;

public class SubmitEnrollmentValidator : AbstractValidator<SubmitEnrollmentDto>
{
    public SubmitEnrollmentValidator()
    {
        RuleFor(x => x.CourseId)
            .NotEmpty().WithMessage("Course ID is required.")
            .NotEqual(Guid.Empty).WithMessage("A valid Course ID must be provided.");
    }
}