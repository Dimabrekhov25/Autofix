using Autofix.Application.Diagnosis.Dtos;
using Autofix.Domain.Entities.ServiceOrders;

namespace Autofix.Application.Diagnosis.Mapping;

public static class DiagnosisItemMapper
{
    public static DiagnosisItemDto ToDiagnosisItemDto(this DiagnosisItem diagnosisItem)
    {
        return new DiagnosisItemDto
        {
            Id = diagnosisItem.Id,
            ServiceOrderId = diagnosisItem.ServiceOrderId,
            Description = diagnosisItem.Description,
            Severity = diagnosisItem.Severity,
            CreatedAt = diagnosisItem.CreatedAt,
            UpdatedAt = diagnosisItem.UpdatedAt
        };
    }
}
