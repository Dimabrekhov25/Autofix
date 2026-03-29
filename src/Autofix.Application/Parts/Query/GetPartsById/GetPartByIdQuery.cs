using Autofix.Application.Parts.Dtos;
using MediatR;
using System;

namespace Autofix.Application.Parts.Queries.GetPartById;

public sealed record GetPartByIdQuery(Guid Id) : IRequest<PartDto?>;