using Autofix.Domain.Entities.Inventory;

namespace Autofix.Application.Common.Interfaces;

public interface IPartRepository
{
    Task<Part> AddAsync(Part part, CancellationToken cancellationToken);
    Task<Part?> GetByIdAsync(Guid id, CancellationToken cancellationToken);
    Task<IReadOnlyList<Part>> GetByIdsAsync(IReadOnlyCollection<Guid> ids, CancellationToken cancellationToken);
    Task<IReadOnlyList<Part>> GetAllAsync(CancellationToken cancellationToken);
    Task UpdateAsync(Part part, CancellationToken cancellationToken);
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken);
}
