using Autofix.Application.Parts.Dtos;
using MediatR;

namespace Autofix.Application.Parts.Query.GetAllParts;

public sealed record GetPartsQuery() : IRequest<IReadOnlyList<PartDto>>;
