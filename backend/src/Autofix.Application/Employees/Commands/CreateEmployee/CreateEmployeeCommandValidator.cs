using FluentValidation;

namespace Autofix.Application.Employees.Commands.CreateEmployee;

/// <summary>
/// Validation for <see cref="CreateEmployeeCommand"/>.
/// </summary>
public sealed class CreateEmployeeCommandValidator : AbstractValidator<CreateEmployeeCommand>
{
    /// <summary>
    /// Configures validation rules applied before the handler runs.
    /// </summary>
    public CreateEmployeeCommandValidator()
    {
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
