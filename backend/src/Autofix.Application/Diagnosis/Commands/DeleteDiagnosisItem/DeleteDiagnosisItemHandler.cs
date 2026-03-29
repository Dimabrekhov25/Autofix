using Autofix.Application.Common.Interfaces;
using MediatR;

namespace Autofix.Application.Diagnosis.Commands.DeleteDiagnosisItem;

public sealed class DeleteDiagnosisItemHandler(IDiagnosisItemRepository repository) : IRequestHandler<DeleteDiagnosisItemCommand, bool>
{
    public async Task<bool> Handle(DeleteDiagnosisItemCommand request, CancellationToken cancellationToken)
    {
        return await repository.DeleteAsync(request.Id, cancellationToken);
    }
}
