using Autofix.Application.Common.Interfaces;
using Autofix.Application.ServiceOrders.Dtos;
using Autofix.Application.ServiceOrders.Mapping;
using MediatR;

namespace Autofix.Application.ServiceOrders.Queries.GetCustomerApprovalNotifications;

public sealed class GetCustomerApprovalNotificationsHandler(IServiceOrderRepository repository)
    : IRequestHandler<GetCustomerApprovalNotificationsQuery, IReadOnlyList<ServiceOrderApprovalNotificationDto>>
{
    public async Task<IReadOnlyList<ServiceOrderApprovalNotificationDto>> Handle(
        GetCustomerApprovalNotificationsQuery request,
        CancellationToken cancellationToken)
    {
        var notifications = await repository.GetUnreadCustomerApprovalNotificationsAsync(cancellationToken);
        return notifications
            .Select(serviceOrder => serviceOrder.ToApprovalNotificationDto())
            .ToList();
    }
}
