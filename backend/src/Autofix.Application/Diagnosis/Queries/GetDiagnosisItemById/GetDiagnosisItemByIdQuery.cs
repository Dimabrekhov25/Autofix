using Autofix.Application.Diagnosis.Dtos;
using MediatR;

namespace Autofix.Application.Diagnosis.Queries.GetDiagnosisItemById;

public sealed record GetDiagnosisItemByIdQuery(Guid Id) : IRequest<DiagnosisItemDto?>;
