using Autofix.Application.Common.Interfaces;
using Autofix.Application.ServiceCatalog.Dtos;
using Autofix.Application.ServiceCatalog.Mapping;
using Autofix.Domain.Entities.Catalog;
using Autofix.Domain.Exceptions;
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
        // Update follows "null when missing" contract for absent catalog items.
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
        item.RequiredParts = await BuildRequiredPartsAsync(request.RequiredParts, cancellationToken);
        item.UpdatedAt = DateTime.UtcNow;

        // Repository persists in-place aggregate mutation.
        await repository.UpdateAsync(item, cancellationToken);
        return item.ToDto();
    }

    private async Task<List<ServiceCatalogPartRequirement>> BuildRequiredPartsAsync(
        IReadOnlyList<ServiceCatalogRequiredPartInputDto>? requestedRequirements,
        CancellationToken cancellationToken)
    {
        // Deduplicate part entries and merge quantities per part ID.
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

        // Required parts must already exist in inventory to ensure fulfillable services.
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
