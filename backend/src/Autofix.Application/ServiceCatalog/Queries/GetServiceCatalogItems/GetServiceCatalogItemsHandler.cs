using Autofix.Application.ServiceCatalog.Dtos;
using Autofix.Application.ServiceCatalog.Mapping;
using Autofix.Application.Common.Interfaces;
using Autofix.Domain.Enum;
using MediatR;

namespace Autofix.Application.ServiceCatalog.Queries.GetServiceCatalogItems;

public sealed class GetServiceCatalogItemsHandler(
    IServiceCatalogRepository repository,
    IInventoryRepository inventoryRepository)
    : IRequestHandler<GetServiceCatalogItemsQuery, IReadOnlyList<ServiceCatalogItemDto>>
{
    public async Task<IReadOnlyList<ServiceCatalogItemDto>> Handle(GetServiceCatalogItemsQuery request, CancellationToken cancellationToken)
    {
        var items = await repository.GetAllAsync(request.IsActive, null, cancellationToken);

        if (request.Category.HasValue)
        {
            items = items
                .Where(item => item.Category == request.Category.Value)
                .ToList();
        }

        if (request.BookableOnly)
        {
            var inventoryByPartId = (await inventoryRepository.GetAllAsync(cancellationToken))
                .ToDictionary(item => item.PartId);

            items = items
                .Where(item => IsBookable(item, inventoryByPartId))
                .ToList();
        }

        return items.Select(item => item.ToDto()).ToList();
    }

    private static bool IsBookable(
        Domain.Entities.Catalog.ServiceCatalogItem item,
        IReadOnlyDictionary<Guid, Domain.Entities.Inventory.InventoryItem> inventoryByPartId)
    {
        if (item.Category == ServiceCatalogCategory.Diagnostic)
        {
            return true;
        }

        foreach (var requiredPart in item.RequiredParts.Where(part => !part.IsDeleted))
        {
            if (!inventoryByPartId.TryGetValue(requiredPart.PartId, out var inventoryItem))
            {
                return false;
            }

            var availableQuantity = inventoryItem.QuantityOnHand - inventoryItem.ReservedQuantity;
            if (availableQuantity < requiredPart.Quantity)
            {
                return false;
            }
        }

        return true;
    }
}
