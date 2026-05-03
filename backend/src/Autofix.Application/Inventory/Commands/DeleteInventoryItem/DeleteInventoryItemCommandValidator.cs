using FluentValidation;

namespace Autofix.Application.Inventory.Commands.DeleteInventoryItem;

/// <summary>
/// Validation for <see cref="DeleteInventoryItemCommand"/>.
/// </summary>
public sealed class DeleteInventoryItemCommandValidator : AbstractValidator<DeleteInventoryItemCommand>
{
    /// <summary>
    /// Configures validation rules applied before the handler runs.
    /// </summary>
    public DeleteInventoryItemCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty();
    }
}
