namespace Autofix.Application.Customers.Dtos;

/// <summary>
/// Customer profile read model (linked application user and contact fields).
/// </summary>
public sealed record CustomerDto(
    Guid Id,
    Guid UserId,
    string FullName,
    string Phone,
    string? Email,
    string? Notes
);
