using FluentValidation;

namespace Autofix.Application.Employees.Commands.DeleteEmployee;

/// <summary>
/// Validation for <see cref="DeleteEmployeeCommand"/>.
/// </summary>
public sealed class DeleteEmployeeCommandValidator : AbstractValidator<DeleteEmployeeCommand>
{
    /// <summary>
    /// Configures validation rules applied before the handler runs.
    /// </summary>
    public DeleteEmployeeCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty();
    }
}
