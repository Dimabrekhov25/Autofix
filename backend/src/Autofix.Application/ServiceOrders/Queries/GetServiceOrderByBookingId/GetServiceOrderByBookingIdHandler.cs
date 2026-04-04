using Autofix.Application.Common.Interfaces;
using Autofix.Application.ServiceOrders.Dtos;
using Autofix.Application.ServiceOrders.Mapping;
using MediatR;

namespace Autofix.Application.ServiceOrders.Queries.GetServiceOrderByBookingId;

public sealed class GetServiceOrderByBookingIdHandler(IServiceOrderRepository repository)
    : IRequestHandler<GetServiceOrderByBookingIdQuery, ServiceOrderDto?>
{
    public async Task<ServiceOrderDto?> Handle(GetServiceOrderByBookingIdQuery request, CancellationToken cancellationToken)
    {
        var serviceOrder = await repository.GetByBookingIdAsync(request.BookingId, cancellationToken);
        return serviceOrder?.ToDto();
    }
}
