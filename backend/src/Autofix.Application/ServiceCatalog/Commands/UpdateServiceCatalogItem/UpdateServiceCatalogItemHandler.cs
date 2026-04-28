using Autofix.Application.Common.Interfaces;
using Autofix.Application.ServiceCatalog.Dtos;
using Autofix.Application.ServiceCatalog.Mapping;
using Autofix.Domain.Entities.Catalog;
using MediatR;

namespace Autofix.Application.ServiceCatalog.Commands.UpdateServiceCatalogItem;

public sealed class UpdateServiceCatalogItemHandler(
    IServiceCatalogRepository repository,
    IPartRepository partRepository,
    IInventoryRepository inventoryRepository)
    : IRequestHandler<UpdateServiceCatalogItemCommand, ServiceCatalogItemDto?>
{
    public async Task<ServiceCatalogItemDto?> Handle(
        UpdateServiceCatalogItemCommand request,
        CancellationToken cancellationToken)
    {
        var item = await repository.GetByIdAsync(request.Id, cancellationToken);

        if (item is null)
        {
            return null;
        }

        item.Name = request.Name;
        item.Description = request.Description;
        item.Category = request.Category;
        item.BasePrice = request.BasePrice;
        item.EstimatedLaborCost = request.EstimatedLaborCost;
        item.EstimatedDuration = request.EstimatedDuration;
        item.IsActive = request.IsActive;
        item.RequiredParts = await ServiceCatalogRequiredPartsBuilder.BuildAsync(
            request.RequiredParts,
            partRepository,
            inventoryRepository,
            cancellationToken);
        item.UpdatedAt = DateTime.UtcNow;

        await repository.UpdateAsync(item, cancellationToken);
        return item.ToDto();
    }
}
