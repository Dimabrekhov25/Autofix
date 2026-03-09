using Autofix.Application.ServiceCatalog.Dtos;
using MediatR;

namespace Autofix.Application.ServiceCatalog.Queries.GetServiceCatalogItems;

public sealed record GetServiceCatalogItemsQuery() : IRequest<IReadOnlyList<ServiceCatalogItemDto>>;
