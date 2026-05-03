using Autofix.Domain.Entities.ServiceOrders;

namespace Autofix.Application.Common.Interfaces;

public interface IServiceOrderRepository
{
    Task<ServiceOrder?> GetByIdAsync(Guid id, CancellationToken cancellationToken);
    Task<ServiceOrder?> GetByBookingIdAsync(Guid bookingId, CancellationToken cancellationToken);
    Task<IReadOnlyList<ServiceOrder>> GetUnreadCustomerApprovalNotificationsAsync(CancellationToken cancellationToken);
    Task<ServiceOrder?> MarkCustomerApprovalNotificationReadAsync(Guid serviceOrderId, CancellationToken cancellationToken);
}
