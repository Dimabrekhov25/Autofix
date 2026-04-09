using Autofix.Application.ServiceOrders.Dtos;
using MediatR;

namespace Autofix.Application.ServiceOrders.Queries.GetCustomerApprovalNotifications;

public sealed record GetCustomerApprovalNotificationsQuery()
    : IRequest<IReadOnlyList<ServiceOrderApprovalNotificationDto>>;
