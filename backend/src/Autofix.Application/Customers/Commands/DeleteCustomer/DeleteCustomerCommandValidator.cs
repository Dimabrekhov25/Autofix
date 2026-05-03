using FluentValidation;

namespace Autofix.Application.Customers.Commands.DeleteCustomer;

/// <summary>
/// Validation for <see cref="DeleteCustomerCommand"/>.
/// </summary>
public sealed class DeleteCustomerCommandValidator : AbstractValidator<DeleteCustomerCommand>
{
    /// <summary>
    /// Configures validation rules applied before the handler runs.
    /// </summary>
    public DeleteCustomerCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty();
    }
}
