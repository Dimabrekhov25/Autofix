using Autofix.Application.ServiceOrders.Dtos;
using MediatR;

namespace Autofix.Application.ServiceOrders.Commands.RemoveServiceOrderPartItem;

/// <summary>
/// Removes a part line from the order; response DTO is <c>null</c> when order or line is missing.
/// </summary>
public sealed record RemoveServiceOrderPartItemCommand(
    Guid Id,
    Guid PartItemId) : IRequest<ServiceOrderDto?>;
