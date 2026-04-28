using Autofix.Application.Common.Interfaces;
using Autofix.Application.ServiceCatalog.Dtos;
using Autofix.Domain.Entities.Catalog;
using Autofix.Domain.Exceptions;

namespace Autofix.Application.ServiceCatalog;

internal static class ServiceCatalogRequiredPartsBuilder
{
    internal static async Task<List<ServiceCatalogPartRequirement>> BuildAsync(
        IReadOnlyList<ServiceCatalogRequiredPartInputDto>? requestedRequirements,
        IPartRepository partRepository,
        IInventoryRepository inventoryRepository,
        CancellationToken cancellationToken)
    {
        var normalizedRequirements = requestedRequirements?
            .Where(requirement => requirement.PartId != Guid.Empty && requirement.Quantity > 0)
            .GroupBy(requirement => requirement.PartId)
            .Select(group =>
                new ServiceCatalogRequiredPartInputDto(group.Key, group.Sum(item => item.Quantity)))
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
            var missingPartIds = string.Join(
                ", ",
                normalizedRequirements.Select(requirement => requirement.PartId));

            throw new NotFoundException("Part", missingPartIds);
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
