using Autofix.Application.Common.Interfaces;
using Autofix.Application.Employees.Dtos;
using Autofix.Application.Employees.Mapping;
using MediatR;

namespace Autofix.Application.Employees.Queries.GetEmployeeById;

public sealed class GetEmployeeByIdHandler(IEmployeeRepository repository)
    : IRequestHandler<GetEmployeeByIdQuery, EmployeeDto?>
{
    public async Task<EmployeeDto?> Handle(GetEmployeeByIdQuery request, CancellationToken cancellationToken)
    {
        var employee = await repository.GetByIdAsync(request.Id, cancellationToken);
        return employee?.ToDto();
    }
}
