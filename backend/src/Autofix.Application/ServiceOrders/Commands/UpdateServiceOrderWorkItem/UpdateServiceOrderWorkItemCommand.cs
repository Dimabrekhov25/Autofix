using Autofix.Application.ServiceOrders.Dtos;
using MediatR;

namespace Autofix.Application.ServiceOrders.Commands.UpdateServiceOrderWorkItem;

public sealed record UpdateServiceOrderWorkItemCommand(
    Guid Id,
    Guid WorkItemId,
    decimal LaborHours,
    decimal HourlyRate) : IRequest<ServiceOrderDto?>;
