using Autofix.Application.Common.Interfaces;
using MediatR;

namespace Autofix.Application.Parts.Commands.DeletePart;

public sealed class DeletePartHandler(IPartRepository repository)
    : IRequestHandler<DeletePartCommand, bool>
{
    public Task<bool> Handle(DeletePartCommand request, CancellationToken cancellationToken)
        => repository.DeleteAsync(request.Id, cancellationToken);
}
