using Autofix.Application.ServiceOrders.Dtos;
using Autofix.Domain.Enum;
using MediatR;

namespace Autofix.Application.ServiceOrders.Commands.UpdateServiceOrderStatus;

/// <summary>
/// Workshop workflow: set service order status by id.
/// </summary>
public sealed record UpdateServiceOrderStatusCommand(
    Guid Id,
    ServiceOrderStatus Status) : IRequest<ServiceOrderDto?>;
