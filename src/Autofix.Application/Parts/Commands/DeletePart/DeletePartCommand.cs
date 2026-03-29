using MediatR;
using System;

namespace Autofix.Application.Parts.Commands.DeletePart;

public sealed record DeletePartCommand(Guid Id) : IRequest<bool>;