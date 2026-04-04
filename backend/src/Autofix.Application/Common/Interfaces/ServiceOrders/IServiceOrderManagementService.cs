using Autofix.Domain.Entities.ServiceOrders;
using Autofix.Domain.Enum;

namespace Autofix.Application.Common.Interfaces.ServiceOrders;

public interface IServiceOrderManagementService
{
    Task<ServiceOrder> AddCatalogItemsAsync(
        Guid serviceOrderId,
        IReadOnlyList<Guid> serviceCatalogItemIds,
        CancellationToken cancellationToken);

    Task<ServiceOrder> AddManualPartAsync(
        Guid serviceOrderId,
        Guid partId,
        int quantity,
        CancellationToken cancellationToken);

    Task<ServiceOrder?> RemovePartItemAsync(
        Guid serviceOrderId,
        Guid partItemId,
        CancellationToken cancellationToken);

    Task<ServiceOrder?> UpdateStatusAsync(
        Guid serviceOrderId,
        ServiceOrderStatus status,
        CancellationToken cancellationToken);
}
