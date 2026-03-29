using Autofix.Application.Common.Interfaces;
using Autofix.Application.Diagnosis.Dtos;
using Autofix.Application.Diagnosis.Mapping;
using MediatR;

namespace Autofix.Application.Diagnosis.Commands.UpdateDiagnosisItem;

public sealed class UpdateDiagnosisItemHandler(IDiagnosisItemRepository repository) : IRequestHandler<UpdateDiagnosisItemCommand, DiagnosisItemDto?>
{
    public async Task<DiagnosisItemDto?> Handle(UpdateDiagnosisItemCommand request, CancellationToken cancellationToken)
    {
        var diagnosisItem = await repository.GetByIdAsync(request.Id, cancellationToken);

        if (diagnosisItem is null)
        {
            return null;
        }

        diagnosisItem.Description = request.Description;
        diagnosisItem.Severity = request.Severity;
        diagnosisItem.UpdatedAt = DateTime.UtcNow;

        await repository.UpdateAsync(diagnosisItem, cancellationToken);

        return diagnosisItem.ToDiagnosisItemDto();
    }
}
