using Autofix.Application.Common.Interfaces;
using MediatR;

namespace Autofix.Application.Inventory.Commands.DeleteInventoryItem;

/// <summary>
/// Removes an inventory item via the repository.
/// </summary>
public sealed class DeleteInventoryItemHandler(IInventoryRepository inventoryRepository)
    : IRequestHandler<DeleteInventoryItemCommand, bool>
{
    /// <inheritdoc />
    public Task<bool> Handle(DeleteInventoryItemCommand request, CancellationToken cancellationToken)
    {
        return inventoryRepository.DeleteAsync(request.Id, cancellationToken);
    }
}
