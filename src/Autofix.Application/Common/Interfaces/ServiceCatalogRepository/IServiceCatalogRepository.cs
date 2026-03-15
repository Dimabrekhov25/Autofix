using Autofix.Domain.Entities.Catalog;

namespace Autofix.Application.Common.Interfaces;

public interface IServiceCatalogRepository
{
    Task<ServiceCatalogItem> AddAsync(ServiceCatalogItem item, CancellationToken cancellationToken);
    Task<ServiceCatalogItem?> GetByIdAsync(Guid id, CancellationToken cancellationToken);
    Task<IReadOnlyList<ServiceCatalogItem>> GetAllAsync(CancellationToken cancellationToken);
}
