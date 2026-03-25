using Autofix.Application.ServiceCatalog.Dtos;
using MediatR;

namespace Autofix.Application.ServiceCatalog.Queries.GetServiceCatalogItemById;

public sealed record GetServiceCatalogItemByIdQuery(Guid Id) : IRequest<ServiceCatalogItemDto?>;
