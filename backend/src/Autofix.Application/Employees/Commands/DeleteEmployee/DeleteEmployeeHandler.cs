using Autofix.Application.Common.Interfaces;
using MediatR;

namespace Autofix.Application.Employees.Commands.DeleteEmployee;

/// <summary>
/// Removes an employee via the repository.
/// </summary>
public sealed class DeleteEmployeeHandler(IEmployeeRepository repository)
    : IRequestHandler<DeleteEmployeeCommand, bool>
{
    /// <inheritdoc />
    public Task<bool> Handle(DeleteEmployeeCommand request, CancellationToken cancellationToken)
        => repository.DeleteAsync(request.Id, cancellationToken);
}
