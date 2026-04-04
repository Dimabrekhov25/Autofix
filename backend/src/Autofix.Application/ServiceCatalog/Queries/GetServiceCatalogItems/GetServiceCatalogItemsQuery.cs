using Autofix.Application.ServiceCatalog.Dtos;
using Autofix.Domain.Enum;
using MediatR;

namespace Autofix.Application.ServiceCatalog.Queries.GetServiceCatalogItems;

public sealed record GetServiceCatalogItemsQuery(
    ServiceCatalogCategory? Category = null,
    bool? IsActive = null,
    bool BookableOnly = false) : IRequest<IReadOnlyList<ServiceCatalogItemDto>>;
