using Autofix.Application.Parts.Dtos;
using MediatR;

namespace Autofix.Application.Parts.Query.GetPartsById;

public sealed record GetPartByIdQuery(Guid Id) : IRequest<PartDto?>;
