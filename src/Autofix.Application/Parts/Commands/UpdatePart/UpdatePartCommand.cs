using Autofix.Application.Parts.Dtos;
using MediatR;

namespace Autofix.Application.Parts.Commands.UpdatePart;

public sealed record UpdatePartCommand(
    Guid Id,
    string Name,
    decimal UnitPrice,
    bool IsActive
) : IRequest<PartDto?>;