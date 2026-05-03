using Autofix.Application.Customers.Dtos;
using MediatR;

namespace Autofix.Application.Customers.Commands.UpdateCustomer;

/// <summary>
/// Updates customer fields; handler returns <c>null</c> if the customer does not exist.
/// </summary>
public sealed record UpdateCustomerCommand(
    Guid Id,
    Guid UserId,
    string FullName,
    string Phone,
    string? Email,
    string? Notes
) : IRequest<CustomerDto?>;
