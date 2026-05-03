using Autofix.Application.Parts.Dtos;
using MediatR;

namespace Autofix.Application.Parts.Commands.CreatePart;

/// <summary>
/// Creates a catalog part with pricing and active state.
/// </summary>
public sealed record CreatePartCommand(
    string Name,
    decimal UnitPrice,
    bool IsActive = true
) : IRequest<PartDto>;
