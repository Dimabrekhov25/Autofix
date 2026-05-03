using Autofix.Domain.Entities.ServiceOrders;

namespace Autofix.Application.Common.Interfaces;

/// <summary>Read-oriented persistence for <see cref="ServiceOrder"/> and customer notification flags.</summary>
public interface IServiceOrderRepository
{
    /// <summary>Gets service order by id.</summary>
    Task<ServiceOrder?> GetByIdAsync(Guid id, CancellationToken cancellationToken);
    /// <summary>Gets the service order created for a booking.</summary>
    Task<ServiceOrder?> GetByBookingIdAsync(Guid bookingId, CancellationToken cancellationToken);
    /// <summary>Service orders with unread customer-approval notifications (admin inbox).</summary>
    Task<IReadOnlyList<ServiceOrder>> GetUnreadCustomerApprovalNotificationsAsync(CancellationToken cancellationToken);
    /// <summary>Marks the notification read; returns updated aggregate or <c>null</c>.</summary>
    Task<ServiceOrder?> MarkCustomerApprovalNotificationReadAsync(Guid serviceOrderId, CancellationToken cancellationToken);
}
