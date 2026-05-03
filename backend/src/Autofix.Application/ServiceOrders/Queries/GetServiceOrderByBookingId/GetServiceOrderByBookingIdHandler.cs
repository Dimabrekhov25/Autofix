using Autofix.Application.Common.Interfaces;
using Autofix.Application.ServiceOrders.Dtos;
using Autofix.Application.ServiceOrders.Mapping;
using MediatR;

namespace Autofix.Application.ServiceOrders.Queries.GetServiceOrderByBookingId;

/// <summary>
/// Looks up service order by <see cref="GetServiceOrderByBookingIdQuery.BookingId"/> and maps to DTO.
/// </summary>
public sealed class GetServiceOrderByBookingIdHandler(IServiceOrderRepository repository)
    : IRequestHandler<GetServiceOrderByBookingIdQuery, ServiceOrderDto?>
{
    /// <inheritdoc />
    public async Task<ServiceOrderDto?> Handle(GetServiceOrderByBookingIdQuery request, CancellationToken cancellationToken)
    {
        var serviceOrder = await repository.GetByBookingIdAsync(request.BookingId, cancellationToken);
        return serviceOrder?.ToDto();
    }
}
