using Autofix.Application.Common.Interfaces;
using Autofix.Application.ServiceOrders.Dtos;
using Autofix.Application.ServiceOrders.Mapping;
using MediatR;

namespace Autofix.Application.ServiceOrders.Commands.MarkCustomerApprovalNotificationRead;

public sealed class MarkCustomerApprovalNotificationReadHandler(IServiceOrderRepository repository)
    : IRequestHandler<MarkCustomerApprovalNotificationReadCommand, ServiceOrderApprovalNotificationDto?>
{
    public async Task<ServiceOrderApprovalNotificationDto?> Handle(
        MarkCustomerApprovalNotificationReadCommand request,
        CancellationToken cancellationToken)
    {
        var serviceOrder = await repository.MarkCustomerApprovalNotificationReadAsync(
            request.ServiceOrderId,
            cancellationToken);

        return serviceOrder?.ToApprovalNotificationDto();
    }
}
