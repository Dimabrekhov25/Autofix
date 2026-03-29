using Autofix.Application.Common.Interfaces;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace Autofix.Application.Parts.Commands.DeletePart;

public sealed class DeletePartHandler(IPartRepository repository)
    : IRequestHandler<DeletePartCommand, bool>
{
    public Task<bool> Handle(DeletePartCommand request, CancellationToken cancellationToken)
        => repository.DeleteAsync(request.Id, cancellationToken);
}