using Autofix.Application.Parts.Dtos;
using MediatR;

namespace Autofix.Application.Parts.Query.GetPartsById;

/// <summary>
/// Loads a single part by id.
/// </summary>
public sealed record GetPartByIdQuery(Guid Id) : IRequest<PartDto?>;
