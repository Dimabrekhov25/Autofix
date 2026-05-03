using FluentValidation;

namespace Autofix.Application.Employees.Queries.GetEmployeeById;

/// <summary>
/// Validation for <see cref="GetEmployeeByIdQuery"/>.
/// </summary>
public sealed class GetEmployeeByIdQueryValidator : AbstractValidator<GetEmployeeByIdQuery>
{
    /// <summary>
    /// Configures validation rules applied before the handler runs.
    /// </summary>
    public GetEmployeeByIdQueryValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty();
    }
}
