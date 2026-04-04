using Autofix.Application.Common.Interfaces.ServiceOrders;
using Autofix.Application.ServiceOrders.Dtos;
using Autofix.Application.ServiceOrders.Mapping;
using MediatR;

namespace Autofix.Application.ServiceOrders.Commands.UpdateServiceOrderStatus;

public sealed class UpdateServiceOrderStatusHandler(IServiceOrderManagementService serviceOrderManagementService)
    : IRequestHandler<UpdateServiceOrderStatusCommand, ServiceOrderDto?>
{
    public async Task<ServiceOrderDto?> Handle(
        UpdateServiceOrderStatusCommand request,
        CancellationToken cancellationToken)
    {
        var serviceOrder = await serviceOrderManagementService.UpdateStatusAsync(
            request.Id,
            request.Status,
            cancellationToken);

        return serviceOrder?.ToDto();
    }
}
