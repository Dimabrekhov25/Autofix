using Autofix.Domain.Entities.People;

namespace Autofix.Application.Common.Interfaces;

public interface ICustomerRepository
{
    Task<Customer> AddAsync(Customer customer, CancellationToken cancellationToken);
    Task<Customer?> GetByIdAsync(Guid id, CancellationToken cancellationToken);
    Task<Customer?> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken);
    Task<IReadOnlyList<Customer>> GetAllAsync(CancellationToken cancellationToken);
    Task UpdateAsync(Customer customer, CancellationToken cancellationToken);
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken);
}
