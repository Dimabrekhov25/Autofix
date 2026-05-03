using Autofix.Domain.Entities.Catalog;

namespace Autofix.Application.Common.Interfaces;

/// <summary>Workshop service definitions offered to customers (with required parts, pricing, duration).</summary>
public interface IServiceCatalogRepository
{
    /// <summary>Adds a catalog item.</summary>
    Task<ServiceCatalogItem> AddAsync(ServiceCatalogItem item, CancellationToken cancellationToken);
    /// <summary>Gets by id.</summary>
    Task<ServiceCatalogItem?> GetByIdAsync(Guid id, CancellationToken cancellationToken);
    /// <summary>Bulk load by ids (order not guaranteed).</summary>
    Task<IReadOnlyList<ServiceCatalogItem>> GetByIdsAsync(
        IReadOnlyCollection<Guid> ids,
        CancellationToken cancellationToken);
    /// <summary>Lists items with optional active filter and id allow-list.</summary>
    Task<IReadOnlyList<ServiceCatalogItem>> GetAllAsync(
        bool? isActive,
        Guid[]? ids,
        CancellationToken cancellationToken);
    /// <summary>Persists changes.</summary>
    Task UpdateAsync(ServiceCatalogItem item, CancellationToken cancellationToken);
    /// <summary>Soft or hard delete per implementation; <c>true</c> if applied.</summary>
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken);
}
