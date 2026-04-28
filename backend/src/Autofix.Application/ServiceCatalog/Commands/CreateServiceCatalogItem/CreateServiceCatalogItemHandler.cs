using Autofix.Application.ServiceCatalog.Dtos;
using Autofix.Application.ServiceCatalog.Mapping;
using Autofix.Application.Common.Interfaces;
using Autofix.Domain.Entities.Catalog;
using MediatR;

namespace Autofix.Application.ServiceCatalog.Commands.CreateServiceCatalogItem;

public sealed class CreateServiceCatalogItemHandler(
    IServiceCatalogRepository repository,
    IPartRepository partRepository,
    IInventoryRepository inventoryRepository)
    : IRequestHandler<CreateServiceCatalogItemCommand, ServiceCatalogItemDto>
{
    public async Task<ServiceCatalogItemDto> Handle(CreateServiceCatalogItemCommand request, CancellationToken cancellationToken)
    {
        var requirements = await ServiceCatalogRequiredPartsBuilder.BuildAsync(
            request.RequiredParts,
            partRepository,
            inventoryRepository,
            cancellationToken);

        var item = new ServiceCatalogItem
        {
            Name = request.Name,
            Description = request.Description,
            Category = request.Category,
            BasePrice = request.BasePrice,
            EstimatedLaborCost = request.EstimatedLaborCost,
            EstimatedDuration = request.EstimatedDuration,
            IsActive = request.IsActive,
            RequiredParts = requirements
        };

        var saved = await repository.AddAsync(item, cancellationToken);
        
        return saved.ToDto();
    }
}
