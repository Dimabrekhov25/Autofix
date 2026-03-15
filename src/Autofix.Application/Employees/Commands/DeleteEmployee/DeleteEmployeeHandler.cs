using Autofix.Application.Common.Interfaces;
using MediatR;

namespace Autofix.Application.Employees.Commands.DeleteEmployee;

public sealed class DeleteEmployeeHandler(IEmployeeRepository repository)
    : IRequestHandler<DeleteEmployeeCommand, bool>
{
    public Task<bool> Handle(DeleteEmployeeCommand request, CancellationToken cancellationToken)
        => repository.DeleteAsync(request.Id, cancellationToken);
}
