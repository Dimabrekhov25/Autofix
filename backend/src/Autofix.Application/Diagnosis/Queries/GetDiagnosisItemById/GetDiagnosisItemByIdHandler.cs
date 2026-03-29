using Autofix.Application.Common.Interfaces;
using Autofix.Application.Diagnosis.Dtos;
using Autofix.Application.Diagnosis.Mapping;
using MediatR;

namespace Autofix.Application.Diagnosis.Queries.GetDiagnosisItemById;

public sealed class GetDiagnosisItemByIdHandler(IDiagnosisItemRepository repository) : IRequestHandler<GetDiagnosisItemByIdQuery, DiagnosisItemDto?>
{
    public async Task<DiagnosisItemDto?> Handle(GetDiagnosisItemByIdQuery request, CancellationToken cancellationToken)
    {
        var diagnosisItem = await repository.GetByIdAsync(request.Id, cancellationToken);
        return diagnosisItem?.ToDiagnosisItemDto();
    }
}
