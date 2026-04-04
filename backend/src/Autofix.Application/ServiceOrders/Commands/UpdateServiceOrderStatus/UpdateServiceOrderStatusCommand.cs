using Autofix.Application.ServiceOrders.Dtos;
using Autofix.Domain.Enum;
using MediatR;

namespace Autofix.Application.ServiceOrders.Commands.UpdateServiceOrderStatus;

public sealed record UpdateServiceOrderStatusCommand(
    Guid Id,
    ServiceOrderStatus Status) : IRequest<ServiceOrderDto?>;
