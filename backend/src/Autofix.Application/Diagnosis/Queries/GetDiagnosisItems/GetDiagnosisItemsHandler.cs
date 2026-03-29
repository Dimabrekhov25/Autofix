using Autofix.Application.Common.Interfaces;
using Autofix.Application.Diagnosis.Dtos;
using Autofix.Application.Diagnosis.Mapping;
using MediatR;

namespace Autofix.Application.Diagnosis.Queries.GetDiagnosisItems;

public sealed class GetDiagnosisItemsHandler(IDiagnosisItemRepository repository) : IRequestHandler<GetDiagnosisItemsQuery, IEnumerable<DiagnosisItemDto>>
{
    public async Task<IEnumerable<DiagnosisItemDto>> Handle(GetDiagnosisItemsQuery request, CancellationToken cancellationToken)
    {
        var diagnosisItems = await repository.GetAllAsync(cancellationToken);
        return diagnosisItems.Select(d => d.ToDiagnosisItemDto());
    }
}
