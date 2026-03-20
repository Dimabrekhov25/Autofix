using Autofix.Domain.Entities.Catalog;

namespace Autofix.Application.Common.Interfaces;

public interface IServiceCatalogRepository
{
    Task<ServiceCatalogItem> AddAsync(ServiceCatalogItem item, CancellationToken cancellationToken);
    Task<ServiceCatalogItem?> GetByIdAsync(Guid id, CancellationToken cancellationToken);
    Task<IReadOnlyList<ServiceCatalogItem>> GetByIdsAsync(
        IReadOnlyCollection<Guid> ids,
        CancellationToken cancellationToken);
    Task<IReadOnlyList<ServiceCatalogItem>> GetAllAsync(CancellationToken cancellationToken);
    Task UpdateAsync(ServiceCatalogItem item, CancellationToken cancellationToken);
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken);
}
