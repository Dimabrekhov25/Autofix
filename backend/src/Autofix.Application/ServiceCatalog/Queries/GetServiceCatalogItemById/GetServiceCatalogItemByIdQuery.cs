using Autofix.Application.ServiceCatalog.Dtos;
using MediatR;

namespace Autofix.Application.ServiceCatalog.Queries.GetServiceCatalogItemById;

/// <summary>
/// Loads a single service catalog item by id.
/// </summary>
public sealed record GetServiceCatalogItemByIdQuery(Guid Id) : IRequest<ServiceCatalogItemDto?>;
