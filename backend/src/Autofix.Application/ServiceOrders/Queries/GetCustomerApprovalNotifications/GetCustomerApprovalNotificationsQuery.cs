using Autofix.Application.ServiceOrders.Dtos;
using MediatR;

namespace Autofix.Application.ServiceOrders.Queries.GetCustomerApprovalNotifications;

/// <summary>
/// Admin inbox: unread customer-approval notifications as lightweight DTOs.
/// </summary>
public sealed record GetCustomerApprovalNotificationsQuery()
    : IRequest<IReadOnlyList<ServiceOrderApprovalNotificationDto>>;
