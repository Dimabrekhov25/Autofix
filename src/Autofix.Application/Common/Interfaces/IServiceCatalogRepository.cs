using Autofix.Domain.Entities.Catalog;

namespace Autofix.Application.Common.Interfaces;

public interface IServiceCatalogRepository
{
    Task<ServiceCatalogItem> AddAsync(ServiceCatalogItem item, CancellationToken cancellationToken);
    Task<ServiceCatalogItem?> GetByIdAsync(Guid id, CancellationToken cancellationToken);
    Task<IReadOnlyList<ServiceCatalogItem>> GetAllAsync(CancellationToken cancellationToken);
    Task<ServiceCatalogItem?> UpdateAsync(
        Guid id,
        string name,
        decimal basePrice,
        TimeSpan estimatedDuration,
        bool isActive,
        CancellationToken cancellationToken);
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken);
}
