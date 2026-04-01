using Autofix.Application.Common.Interfaces;
using MediatR;

namespace Autofix.Application.Inventory.Commands.DeleteInventoryItem;

public sealed class DeleteInventoryItemHandler(IInventoryRepository inventoryRepository)
    : IRequestHandler<DeleteInventoryItemCommand, bool>
{
    public Task<bool> Handle(DeleteInventoryItemCommand request, CancellationToken cancellationToken)
    {
        return inventoryRepository.DeleteAsync(request.Id, cancellationToken);
    }
}
