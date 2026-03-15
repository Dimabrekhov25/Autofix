using Autofix.Domain.Entities.People;
using Autofix.Domain.Enum;

namespace Autofix.Application.Common.Interfaces;

public interface IEmployeeRepository
{
    Task<Employee> AddAsync(Employee employee, CancellationToken cancellationToken);
    Task<Employee?> GetByIdAsync(Guid id, CancellationToken cancellationToken);
    Task<IReadOnlyList<Employee>> GetAllAsync(CancellationToken cancellationToken);
    Task<Employee?> UpdateAsync(
        Guid id,
        Guid userId,
        string fullName,
        EmployeeRole role,
        bool isActive,
        CancellationToken cancellationToken);
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken);
}
