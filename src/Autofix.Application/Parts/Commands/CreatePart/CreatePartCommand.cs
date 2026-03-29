using Autofix.Application.Parts.Dtos;
using MediatR;

namespace Autofix.Application.Parts.Commands.CreatePart;

public sealed record CreatePartCommand(
    string Name,
    decimal UnitPrice,
    bool IsActive
) : IRequest<PartDto>;