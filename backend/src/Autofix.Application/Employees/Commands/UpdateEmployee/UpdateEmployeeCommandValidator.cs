using FluentValidation;

namespace Autofix.Application.Employees.Commands.UpdateEmployee;

/// <summary>
/// Validation for <see cref="UpdateEmployeeCommand"/>.
/// </summary>
public sealed class UpdateEmployeeCommandValidator : AbstractValidator<UpdateEmployeeCommand>
{
    /// <summary>
    /// Configures validation rules applied before the handler runs.
    /// </summary>
    public UpdateEmployeeCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty();

        RuleFor(x => x.UserId)
            .NotEmpty();

        RuleFor(x => x.FullName)
            .NotEmpty()
            .Must(name => !string.IsNullOrWhiteSpace(name))
            .WithMessage("Full name must not be empty or whitespace.")
            .MaximumLength(200);

        RuleFor(x => x.Role)
            .IsInEnum();
    }
}
