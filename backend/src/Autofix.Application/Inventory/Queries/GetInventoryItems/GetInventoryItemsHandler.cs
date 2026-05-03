using Autofix.Application.Common.Interfaces;
using Autofix.Application.Inventory.Dtos;
using Autofix.Application.Inventory.Mapping;
using MediatR;

namespace Autofix.Application.Inventory.Queries.GetInventoryItems;

/// <summary>
/// Returns every inventory item as a DTO list.
/// </summary>
public sealed class GetInventoryItemsHandler(IInventoryRepository inventoryRepository)
    : IRequestHandler<GetInventoryItemsQuery, IReadOnlyList<InventoryItemDto>>
{
    /// <inheritdoc />
    public async Task<IReadOnlyList<InventoryItemDto>> Handle(GetInventoryItemsQuery request, CancellationToken cancellationToken)
    {
        var items = await inventoryRepository.GetAllAsync(cancellationToken);
        return items.Select(item => item.ToDto()).ToList();
    }
}
