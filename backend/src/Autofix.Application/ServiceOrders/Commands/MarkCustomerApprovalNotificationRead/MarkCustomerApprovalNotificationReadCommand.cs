using Autofix.Application.ServiceOrders.Dtos;
using MediatR;

namespace Autofix.Application.ServiceOrders.Commands.MarkCustomerApprovalNotificationRead;

/// <summary>
/// Marks the customer-approval notification as read for a service order; returns updated card or <c>null</c>.
/// </summary>
public sealed record MarkCustomerApprovalNotificationReadCommand(Guid ServiceOrderId)
    : IRequest<ServiceOrderApprovalNotificationDto?>;
