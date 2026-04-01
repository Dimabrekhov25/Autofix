using Autofix.Application.Common.Interfaces;
using Autofix.Application.Inventory.Dtos;
using Autofix.Application.Inventory.Mapping;
using MediatR;

namespace Autofix.Application.Inventory.Queries.GetInventoryItemById;

public sealed class GetInventoryItemByIdHandler(IInventoryRepository inventoryRepository)
    : IRequestHandler<GetInventoryItemByIdQuery, InventoryItemDto?>
{
    public async Task<InventoryItemDto?> Handle(GetInventoryItemByIdQuery request, CancellationToken cancellationToken)
    {
        var item = await inventoryRepository.GetByIdAsync(request.Id, cancellationToken);
        return item is null ? null : item.ToDto();
    }
}
