using Autofix.Application.ServiceCatalog.Dtos;
using Autofix.Domain.Enum;
using MediatR;

namespace Autofix.Application.ServiceCatalog.Commands.CreateServiceCatalogItem;

public sealed record CreateServiceCatalogItemCommand(
    string Name,
    string Description,
    ServiceCatalogCategory Category,
    decimal BasePrice,
    decimal EstimatedLaborCost,
    TimeSpan EstimatedDuration,
    bool IsActive = true
) : IRequest<ServiceCatalogItemDto>;
