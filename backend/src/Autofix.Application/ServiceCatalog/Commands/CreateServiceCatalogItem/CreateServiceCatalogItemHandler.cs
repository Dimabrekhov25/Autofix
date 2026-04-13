using Autofix.Application.ServiceCatalog.Dtos;
using Autofix.Application.ServiceCatalog.Mapping;
using Autofix.Application.Common.Interfaces;
using Autofix.Domain.Entities.Catalog;
using Autofix.Domain.Exceptions;
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
        var requirements = await BuildRequiredPartsAsync(request.RequiredParts, cancellationToken);

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

    private async Task<List<ServiceCatalogPartRequirement>> BuildRequiredPartsAsync(
        IReadOnlyList<ServiceCatalogRequiredPartInputDto>? requestedRequirements,
        CancellationToken cancellationToken)
    {
        var normalizedRequirements = requestedRequirements?
            .Where(requirement => requirement.PartId != Guid.Empty && requirement.Quantity > 0)
            .GroupBy(requirement => requirement.PartId)
            .Select(group => new ServiceCatalogRequiredPartInputDto(group.Key, group.Sum(item => item.Quantity)))
            .ToList() ?? [];

        if (normalizedRequirements.Count == 0)
        {
            return [];
        }

        var parts = await partRepository.GetByIdsAsync(
            normalizedRequirements.Select(requirement => requirement.PartId).ToList(),
            cancellationToken);

        if (parts.Count != normalizedRequirements.Count)
        {
            throw new NotFoundException("Part", string.Join(", ", normalizedRequirements.Select(requirement => requirement.PartId)));
        }

        foreach (var part in parts)
        {
            var inventoryItem = await inventoryRepository.GetByPartIdAsync(part.Id, cancellationToken);
            if (inventoryItem is null)
            {
                throw new ConflictException(
                    $"Part '{part.Name}' must exist in inventory before it can be assigned as a required service part.");
            }
        }

        return normalizedRequirements
            .Select(requirement => new ServiceCatalogPartRequirement
            {
                PartId = requirement.PartId,
                Quantity = requirement.Quantity
            })
            .ToList();
    }
}
