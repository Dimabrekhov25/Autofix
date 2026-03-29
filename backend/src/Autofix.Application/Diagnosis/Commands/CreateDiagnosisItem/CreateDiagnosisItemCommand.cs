using Autofix.Application.Diagnosis.Dtos;
using Autofix.Domain.Enum;
using MediatR;

namespace Autofix.Application.Diagnosis.Commands.CreateDiagnosisItem;

public sealed record CreateDiagnosisItemCommand(
    Guid ServiceOrderId,
    string Description,
    DiagnosisSeverity Severity) : IRequest<DiagnosisItemDto>;
