using Autofix.Application.ServiceCatalog.Dtos;
using Autofix.Domain.Enum;
using MediatR;

namespace Autofix.Application.ServiceCatalog.Queries.GetServiceCatalogItems;

/// <summary>
/// Lists service catalog items with optional category, active, and bookable filters.
/// </summary>
public sealed record GetServiceCatalogItemsQuery(
    ServiceCatalogCategory? Category = null,
    bool? IsActive = null,
    bool BookableOnly = false) : IRequest<IReadOnlyList<ServiceCatalogItemDto>>;
