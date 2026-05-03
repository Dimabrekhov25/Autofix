using Autofix.Application.ServiceCatalog.Dtos;
using Autofix.Domain.Enum;
using MediatR;

namespace Autofix.Application.ServiceCatalog.Commands.CreateServiceCatalogItem;

/// <summary>
/// Creates a service catalog entry with pricing, duration, and optional required parts.
/// </summary>
public sealed record CreateServiceCatalogItemCommand(
    string Name,
    string Description,
    ServiceCatalogCategory Category,
    decimal BasePrice,
    decimal EstimatedLaborCost,
    TimeSpan EstimatedDuration,
    bool IsActive = true,
    IReadOnlyList<ServiceCatalogRequiredPartInputDto>? RequiredParts = null
) : IRequest<ServiceCatalogItemDto>;
