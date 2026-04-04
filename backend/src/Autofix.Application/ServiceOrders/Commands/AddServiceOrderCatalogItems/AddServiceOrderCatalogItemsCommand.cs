using Autofix.Application.ServiceOrders.Dtos;
using MediatR;

namespace Autofix.Application.ServiceOrders.Commands.AddServiceOrderCatalogItems;

public sealed record AddServiceOrderCatalogItemsCommand(
    Guid Id,
    IReadOnlyList<Guid> ServiceCatalogItemIds) : IRequest<ServiceOrderDto>;
