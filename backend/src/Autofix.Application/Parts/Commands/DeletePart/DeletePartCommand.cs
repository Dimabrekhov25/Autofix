using MediatR;

namespace Autofix.Application.Parts.Commands.DeletePart;

public sealed record DeletePartCommand(Guid Id) : IRequest<bool>;
