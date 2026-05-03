using FluentValidation;

namespace Autofix.Application.ServiceOrders.Commands.AddManualServiceOrderPart;

/// <summary>
/// Validation for <see cref="AddManualServiceOrderPartCommand"/>.
/// </summary>
public sealed class AddManualServiceOrderPartCommandValidator : AbstractValidator<AddManualServiceOrderPartCommand>
{
    /// <summary>
    /// Configures validation rules applied before the handler runs.
    /// </summary>
    public AddManualServiceOrderPartCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty();

        RuleFor(x => x.PartId)
            .NotEmpty();

        RuleFor(x => x.Quantity)
            .GreaterThan(0);
    }
}
