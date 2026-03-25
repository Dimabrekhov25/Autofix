using Autofix.Application.Customers.Dtos;
using MediatR;

namespace Autofix.Application.Customers.Commands.CreateCustomer;

public sealed record CreateCustomerCommand(
    Guid UserId,
    string FullName,
    string Phone,
    string? Email,
    string? Notes
) : IRequest<CustomerDto>;
