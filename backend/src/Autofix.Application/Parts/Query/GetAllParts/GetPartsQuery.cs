using Autofix.Application.Parts.Dtos;
using MediatR;

namespace Autofix.Application.Parts.Query.GetAllParts;

/// <summary>
/// Lists all parts.
/// </summary>
public sealed record GetPartsQuery() : IRequest<IReadOnlyList<PartDto>>;
