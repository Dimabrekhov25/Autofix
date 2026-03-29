using Autofix.Domain.Entities.ServiceOrders;

namespace Autofix.Application.Common.Interfaces;

public interface IServiceOrderRepository
{
    Task<ServiceOrder> AddAsync(ServiceOrder serviceOrder, CancellationToken cancellationToken);
    Task<ServiceOrder?> GetByIdAsync(Guid id, CancellationToken cancellationToken);
    Task<IReadOnlyList<ServiceOrder>> GetAllAsync(CancellationToken cancellationToken);
    Task UpdateAsync(ServiceOrder serviceOrder, CancellationToken cancellationToken);
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken);
}

public interface IDiagnosisItemRepository
{
    Task<DiagnosisItem> AddAsync(DiagnosisItem diagnosisItem, CancellationToken cancellationToken);
    Task<DiagnosisItem?> GetByIdAsync(Guid id, CancellationToken cancellationToken);
    Task<IReadOnlyList<DiagnosisItem>> GetAllAsync(CancellationToken cancellationToken);
    Task UpdateAsync(DiagnosisItem diagnosisItem, CancellationToken cancellationToken);
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken);
}
