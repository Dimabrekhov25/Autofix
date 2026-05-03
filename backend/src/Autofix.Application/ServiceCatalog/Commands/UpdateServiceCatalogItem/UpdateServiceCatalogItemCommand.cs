using Autofix.Application.ServiceCatalog.Dtos;
using Autofix.Domain.Enum;
using MediatR;

namespace Autofix.Application.ServiceCatalog.Commands.UpdateServiceCatalogItem;

/// <summary>
/// Updates catalog metadata, economics, duration, active state, and required parts.
/// </summary>
public sealed record UpdateServiceCatalogItemCommand(
    Guid Id,
    string Name,
    string Description,
    ServiceCatalogCategory Category,
    decimal BasePrice,
    decimal EstimatedLaborCost,
    TimeSpan EstimatedDuration,
    bool IsActive,
    IReadOnlyList<ServiceCatalogRequiredPartInputDto>? RequiredParts = null
) : IRequest<ServiceCatalogItemDto?>;
