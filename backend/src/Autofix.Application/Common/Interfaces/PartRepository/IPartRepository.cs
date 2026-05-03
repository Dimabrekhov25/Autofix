using Autofix.Domain.Entities.Inventory;

namespace Autofix.Application.Common.Interfaces;

/// <summary>Part master data (SKU, pricing) used by inventory and service orders.</summary>
public interface IPartRepository
{
    /// <summary>Adds a part.</summary>
    Task<Part> AddAsync(Part part, CancellationToken cancellationToken);
    /// <summary>Gets by id.</summary>
    Task<Part?> GetByIdAsync(Guid id, CancellationToken cancellationToken);
    /// <summary>Bulk load by ids.</summary>
    Task<IReadOnlyList<Part>> GetByIdsAsync(IReadOnlyCollection<Guid> ids, CancellationToken cancellationToken);
    /// <summary>Lists all parts.</summary>
    Task<IReadOnlyList<Part>> GetAllAsync(CancellationToken cancellationToken);
    /// <summary>Persists changes.</summary>
    Task UpdateAsync(Part part, CancellationToken cancellationToken);
    /// <summary>Deletes by id; <c>true</c> if removed.</summary>
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken);
}
