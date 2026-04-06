using FluentValidation;
using LMS.Backend.DTOs.Schedule;

namespace LMS.Backend.Validators
{
    public class SchedulePlanValidator : AbstractValidator<SchedulePlanUpsertDto>
    {
        public SchedulePlanValidator()
        {
            RuleFor(x => x.Title)
                .NotEmpty().WithMessage("Title is required.")
                .MaximumLength(100).WithMessage("Title cannot exceed 100 characters.");

            RuleFor(x => x.Description)
                .MaximumLength(500).WithMessage("Description cannot exceed 500 characters.");

            RuleFor(x => x.StartTime)
                .NotEmpty().WithMessage("Start time is required.");

            RuleFor(x => x.EndTime)
                .NotEmpty().WithMessage("End time is required.")
                .GreaterThan(x => x.StartTime).WithMessage("End time must be after the start time.");

            RuleFor(x => x.Location)
                .MaximumLength(200).WithMessage("Location name is too long.");

            RuleFor(x => x.CourseName)
                .MaximumLength(150).WithMessage("Course name is too long.");

            RuleFor(x => x.InstructorName)
                .MaximumLength(100).WithMessage("Instructor name is too long.");
        }
    }
}