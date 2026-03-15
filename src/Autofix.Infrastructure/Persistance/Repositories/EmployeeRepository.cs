using Autofix.Application.Common.Interfaces;
using Autofix.Domain.Entities.People;
using Autofix.Domain.Enum;
using Microsoft.EntityFrameworkCore;

namespace Autofix.Infrastructure.Persistance.Repositories;

public sealed class EmployeeRepository(ApplicationDbContext dbContext) : IEmployeeRepository
{
    public async Task<Employee> AddAsync(Employee employee, CancellationToken cancellationToken)
    {
        dbContext.Employees.Add(employee);
        await dbContext.SaveChangesAsync(cancellationToken);
        return employee;
    }

    public Task<Employee?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        return dbContext.Employees
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted, cancellationToken);
    }

    public async Task<IReadOnlyList<Employee>> GetAllAsync(CancellationToken cancellationToken)
    {
        var employees = await dbContext.Employees
            .AsNoTracking()
            .Where(x => !x.IsDeleted)
            .OrderBy(x => x.FullName)
            .ToListAsync(cancellationToken);

        return employees;
    }

    public async Task<Employee?> UpdateAsync(
        Guid id,
        Guid userId,
        string fullName,
        EmployeeRole role,
        bool isActive,
        CancellationToken cancellationToken)
    {
        var employee = await dbContext.Employees
            .FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted, cancellationToken);

        if (employee is null)
        {
            return null;
        }

        employee.UserId = userId;
        employee.FullName = fullName;
        employee.Role = role;
        employee.IsActive = isActive;
        employee.UpdatedAt = DateTime.UtcNow;

        await dbContext.SaveChangesAsync(cancellationToken);
        return employee;
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken)
    {
        var employee = await dbContext.Employees
            .FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted, cancellationToken);

        if (employee is null)
        {
            return false;
        }

        employee.IsDeleted = true;
        employee.DeletedAt = DateTime.UtcNow;
        employee.UpdatedAt = DateTime.UtcNow;

        await dbContext.SaveChangesAsync(cancellationToken);
        return true;
    }
}
