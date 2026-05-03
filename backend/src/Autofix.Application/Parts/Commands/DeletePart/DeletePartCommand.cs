using MediatR;

namespace Autofix.Application.Parts.Commands.DeletePart;

/// <summary>
/// Deletes a part by id.
/// </summary>
public sealed record DeletePartCommand(Guid Id) : IRequest<bool>;
