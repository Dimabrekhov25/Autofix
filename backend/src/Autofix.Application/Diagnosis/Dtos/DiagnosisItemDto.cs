using Autofix.Domain.Enum;

namespace Autofix.Application.Diagnosis.Dtos;

public sealed record DiagnosisItemDto
{
    public Guid Id { get; set; }
    public Guid ServiceOrderId { get; set; }
    public string Description { get; set; } = string.Empty;
    public DiagnosisSeverity Severity { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
