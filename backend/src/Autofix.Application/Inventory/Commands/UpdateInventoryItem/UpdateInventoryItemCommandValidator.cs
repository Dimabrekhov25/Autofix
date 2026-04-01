using FluentValidation;

namespace Autofix.Application.Inventory.Commands.UpdateInventoryItem;

public sealed class UpdateInventoryItemCommandValidator : AbstractValidator<UpdateInventoryItemCommand>
{
    public UpdateInventoryItemCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty();

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
