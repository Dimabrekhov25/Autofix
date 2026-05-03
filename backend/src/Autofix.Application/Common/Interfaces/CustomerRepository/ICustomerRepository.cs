using Autofix.Domain.Entities.People;

namespace Autofix.Application.Common.Interfaces;

/// <summary>CRUD persistence for <see cref="Customer"/>.</summary>
public interface ICustomerRepository
{
    /// <summary>Adds a customer.</summary>
    Task<Customer> AddAsync(Customer customer, CancellationToken cancellationToken);
    /// <summary>Gets by primary key.</summary>
    Task<Customer?> GetByIdAsync(Guid id, CancellationToken cancellationToken);
    /// <summary>Resolves the customer profile linked to an application user id.</summary>
    Task<Customer?> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken);
    /// <summary>Lists all customers.</summary>
    Task<IReadOnlyList<Customer>> GetAllAsync(CancellationToken cancellationToken);
    /// <summary>Persists changes.</summary>
    Task UpdateAsync(Customer customer, CancellationToken cancellationToken);
    /// <summary>Deletes by id; <c>true</c> if removed.</summary>
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken);
}
