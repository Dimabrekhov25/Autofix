using Autofix.Application.Common.Interfaces;
using Autofix.Application.Diagnosis.Dtos;
using Autofix.Application.Diagnosis.Mapping;
using Autofix.Domain.Entities.ServiceOrders;
using MediatR;

namespace Autofix.Application.Diagnosis.Commands.CreateDiagnosisItem;

public sealed class CreateDiagnosisItemHandler(IDiagnosisItemRepository repository) : IRequestHandler<CreateDiagnosisItemCommand, DiagnosisItemDto>
{
    public async Task<DiagnosisItemDto> Handle(CreateDiagnosisItemCommand request, CancellationToken cancellationToken)
    {
        var diagnosisItem = new DiagnosisItem
        {
            ServiceOrderId = request.ServiceOrderId,
            Description = request.Description,
            Severity = request.Severity
        };

        var saved = await repository.AddAsync(diagnosisItem, cancellationToken);
        return saved.ToDiagnosisItemDto();
    }
}
