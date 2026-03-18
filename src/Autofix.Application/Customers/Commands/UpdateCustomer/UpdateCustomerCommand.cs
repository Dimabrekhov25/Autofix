using Autofix.Application.Customers.Dtos;
using MediatR;

namespace Autofix.Application.Customers.Commands.UpdateCustomer;

public sealed record UpdateCustomerCommand(
    Guid Id,
    Guid UserId,
    string FullName,
    string Phone,
    string? Email,
    string? Notes
) : IRequest<CustomerDto?>;
