using FluentValidation;

namespace Autofix.Application.ServiceOrders.Commands.AddManualServiceOrderPart;

public sealed class AddManualServiceOrderPartCommandValidator : AbstractValidator<AddManualServiceOrderPartCommand>
{
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
