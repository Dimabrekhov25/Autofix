using MediatR;

namespace Autofix.Application.Employees.Commands.DeleteEmployee;

public sealed record DeleteEmployeeCommand(Guid Id) : IRequest<bool>;
