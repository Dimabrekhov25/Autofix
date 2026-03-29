using MediatR;

namespace Autofix.Application.Diagnosis.Commands.DeleteDiagnosisItem;

public sealed record DeleteDiagnosisItemCommand(Guid Id) : IRequest<bool>;
