using Autofix.Domain.Entities.ServiceOrders;
using Autofix.Domain.Enum;

namespace Autofix.Application.Common.Interfaces.ServiceOrders;

/// <summary>
/// Domain service for mutating service orders: lines, status transitions, and customer approval flow.
/// </summary>
public interface IServiceOrderManagementService
{
    /// <summary>Adds catalog-backed labor lines to an order.</summary>
    Task<ServiceOrder> AddCatalogItemsAsync(
        Guid serviceOrderId,
        IReadOnlyList<Guid> serviceCatalogItemIds,
        CancellationToken cancellationToken);

    /// <summary>Adds a part line not tied to catalog composition.</summary>
    Task<ServiceOrder> AddManualPartAsync(
        Guid serviceOrderId,
        Guid partId,
        int quantity,
        CancellationToken cancellationToken);

    /// <summary>Removes a part line; <c>null</c> if order or line missing.</summary>
    Task<ServiceOrder?> RemovePartItemAsync(
        Guid serviceOrderId,
        Guid partItemId,
        CancellationToken cancellationToken);

    /// <summary>Removes a labor line; <c>null</c> if order or line missing.</summary>
    Task<ServiceOrder?> RemoveWorkItemAsync(
        Guid serviceOrderId,
        Guid workItemId,
        CancellationToken cancellationToken);

    /// <summary>Updates hours/rate for a work item.</summary>
    Task<ServiceOrder?> UpdateWorkItemAsync(
        Guid serviceOrderId,
        Guid workItemId,
        decimal laborHours,
        decimal hourlyRate,
        CancellationToken cancellationToken);

    /// <summary>Sets status by service order id.</summary>
    Task<ServiceOrder?> UpdateStatusAsync(
        Guid serviceOrderId,
        ServiceOrderStatus status,
        CancellationToken cancellationToken);

    /// <summary>Sets status by related booking id (workflow convenience).</summary>
    Task<ServiceOrder?> UpdateStatusByBookingIdAsync(
        Guid bookingId,
        ServiceOrderStatus status,
        CancellationToken cancellationToken);

    /// <summary>Customer approves estimate for the order linked to the booking.</summary>
    Task<ServiceOrder?> ApproveByCustomerAsync(
        Guid bookingId,
        CancellationToken cancellationToken);
}
