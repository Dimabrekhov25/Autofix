using FluentValidation;

namespace Autofix.Application.Inventory.Commands.DeleteInventoryItem;

public sealed class DeleteInventoryItemCommandValidator : AbstractValidator<DeleteInventoryItemCommand>
{
    public DeleteInventoryItemCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty();
    }
}
