using FluentValidation;

namespace Autofix.Application.Customers.Queries.GetCustomerById;

/// <summary>
/// Validation for <see cref="GetCustomerByIdQuery"/>.
/// </summary>
public sealed class GetCustomerByIdQueryValidator : AbstractValidator<GetCustomerByIdQuery>
{
    /// <summary>
    /// Configures validation rules applied before the handler runs.
    /// </summary>
    public GetCustomerByIdQueryValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty();
    }
}
