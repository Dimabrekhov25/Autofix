using Autofix.Application.Diagnosis.Dtos;
using Autofix.Domain.Enum;
using MediatR;

namespace Autofix.Application.Diagnosis.Commands.UpdateDiagnosisItem;

public sealed record UpdateDiagnosisItemCommand(
    Guid Id,
    string Description,
    DiagnosisSeverity Severity) : IRequest<DiagnosisItemDto?>;
