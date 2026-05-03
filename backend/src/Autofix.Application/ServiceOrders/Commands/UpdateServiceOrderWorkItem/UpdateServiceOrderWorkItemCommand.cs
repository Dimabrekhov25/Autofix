using Autofix.Application.ServiceOrders.Dtos;
using MediatR;

namespace Autofix.Application.ServiceOrders.Commands.UpdateServiceOrderWorkItem;

/// <summary>
/// Updates hours and rate on an existing labor line.
/// </summary>
public sealed record UpdateServiceOrderWorkItemCommand(
    Guid Id,
    Guid WorkItemId,
    decimal LaborHours,
    decimal HourlyRate) : IRequest<ServiceOrderDto?>;
