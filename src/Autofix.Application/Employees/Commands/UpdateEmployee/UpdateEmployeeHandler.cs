using Autofix.Application.Common.Interfaces;
using Autofix.Application.Employees.Dtos;
using Autofix.Application.Employees.Mapping;
using MediatR;

namespace Autofix.Application.Employees.Commands.UpdateEmployee;

public sealed class UpdateEmployeeHandler(IEmployeeRepository repository)
    : IRequestHandler<UpdateEmployeeCommand, EmployeeDto?>
{
    public async Task<EmployeeDto?> Handle(UpdateEmployeeCommand request, CancellationToken cancellationToken)
    {
        var updated = await repository.UpdateAsync(
            request.Id,
            request.UserId,
            request.FullName,
            request.Role,
            request.IsActive,
            cancellationToken);

        return updated?.ToDto();
    }
}
