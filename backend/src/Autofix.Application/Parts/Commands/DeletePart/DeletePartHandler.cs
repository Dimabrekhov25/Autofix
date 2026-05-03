using Autofix.Application.Common.Interfaces;
using MediatR;

namespace Autofix.Application.Parts.Commands.DeletePart;

/// <summary>
/// Removes a part via the repository.
/// </summary>
public sealed class DeletePartHandler(IPartRepository repository)
    : IRequestHandler<DeletePartCommand, bool>
{
    /// <inheritdoc />
    public Task<bool> Handle(DeletePartCommand request, CancellationToken cancellationToken)
        => repository.DeleteAsync(request.Id, cancellationToken);
}
