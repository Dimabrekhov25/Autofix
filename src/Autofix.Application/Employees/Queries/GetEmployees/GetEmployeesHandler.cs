using Autofix.Application.Common.Interfaces;
using Autofix.Application.Employees.Dtos;
using Autofix.Application.Employees.Mapping;
using MediatR;

namespace Autofix.Application.Employees.Queries.GetEmployees;

public sealed class GetEmployeesHandler(IEmployeeRepository repository)
    : IRequestHandler<GetEmployeesQuery, IReadOnlyList<EmployeeDto>>
{
    public async Task<IReadOnlyList<EmployeeDto>> Handle(GetEmployeesQuery request, CancellationToken cancellationToken)
    {
        var employees = await repository.GetAllAsync(cancellationToken);
        return employees.Select(employee => employee.ToDto()).ToList();
    }
}
