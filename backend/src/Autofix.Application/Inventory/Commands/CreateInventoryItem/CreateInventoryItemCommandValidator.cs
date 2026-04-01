using FluentValidation;

namespace Autofix.Application.Inventory.Commands.CreateInventoryItem;

public sealed class CreateInventoryItemCommandValidator : AbstractValidator<CreateInventoryItemCommand>
{
    public CreateInventoryItemCommandValidator()
    {
        RuleFor(x => x.PartId)
            .NotEmpty();

        RuleFor(x => x.QuantityOnHand)
            .GreaterThanOrEqualTo(0);

        RuleFor(x => x.ReservedQuantity)
            .GreaterThanOrEqualTo(0);

        RuleFor(x => x.MinLevel)
            .GreaterThanOrEqualTo(0);

        RuleFor(x => x)
            .Must(x => x.ReservedQuantity <= x.QuantityOnHand)
            .WithMessage("Reserved quantity cannot exceed quantity on hand.");
    }
}
