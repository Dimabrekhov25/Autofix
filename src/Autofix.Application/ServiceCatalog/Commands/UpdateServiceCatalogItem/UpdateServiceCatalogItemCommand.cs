using Autofix.Application.ServiceCatalog.Dtos;
using MediatR;

namespace Autofix.Application.ServiceCatalog.Commands.UpdateServiceCatalogItem;

public sealed record UpdateServiceCatalogItemCommand(
    Guid Id,
    string Name,
    decimal BasePrice,
    TimeSpan EstimatedDuration,
    bool IsActive
) : IRequest<ServiceCatalogItemDto?>;
