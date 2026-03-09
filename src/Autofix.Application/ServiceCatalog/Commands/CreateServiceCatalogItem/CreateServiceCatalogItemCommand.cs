using Autofix.Application.ServiceCatalog.Dtos;
using MediatR;

namespace Autofix.Application.ServiceCatalog.Commands.CreateServiceCatalogItem;

public sealed record CreateServiceCatalogItemCommand(
    string Name,
    decimal BasePrice,
    TimeSpan EstimatedDuration,
    bool IsActive = true
) : IRequest<ServiceCatalogItemDto>;
