using Autofix.Domain.Entities.People;

namespace Autofix.Application.Common.Interfaces;

/// <summary>CRUD persistence for <see cref="Employee"/>.</summary>
public interface IEmployeeRepository
{
    /// <summary>Adds an employee.</summary>
    Task<Employee> AddAsync(Employee employee, CancellationToken cancellationToken);
    /// <summary>Gets by primary key.</summary>
    Task<Employee?> GetByIdAsync(Guid id, CancellationToken cancellationToken);
    /// <summary>Lists all employees.</summary>
    Task<IReadOnlyList<Employee>> GetAllAsync(CancellationToken cancellationToken);
    /// <summary>Persists changes.</summary>
    Task UpdateAsync(Employee employee, CancellationToken cancellationToken);
    /// <summary>Deletes by id; <c>true</c> if removed.</summary>
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken);
}
