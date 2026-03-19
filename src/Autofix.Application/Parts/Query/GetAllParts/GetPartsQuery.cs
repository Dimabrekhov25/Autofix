using Autofix.Application.Parts.Dtos;
using MediatR;
using System.Collections.Generic;

namespace Autofix.Application.Parts.Queries.GetParts;

public sealed record GetPartsQuery() : IRequest<IEnumerable<PartDto>>;