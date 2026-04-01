namespace Autofix.Application.Customers.Dtos;

public sealed record CustomerDto(
    Guid Id,
    Guid UserId,
    string FullName,
    string Phone,
    string? Email,
    string? Notes
);
