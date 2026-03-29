using Autofix.Application.Diagnosis.Dtos;
using MediatR;

namespace Autofix.Application.Diagnosis.Queries.GetDiagnosisItems;

public sealed record GetDiagnosisItemsQuery : IRequest<IEnumerable<DiagnosisItemDto>>;
