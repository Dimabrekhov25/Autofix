using Autofix.Application.Parts.Dtos;
using MediatR;

namespace Autofix.Application.Parts.Commands.UpdatePart;

/// <summary>
/// Updates an existing part's name, unit price, and active state.
/// </summary>
public sealed record UpdatePartCommand(
    Guid Id,
    string Name,
    decimal UnitPrice,
    bool IsActive
) : IRequest<PartDto?>;
