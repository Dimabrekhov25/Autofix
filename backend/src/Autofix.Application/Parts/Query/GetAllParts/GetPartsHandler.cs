using Autofix.Application.Common.Interfaces;
using Autofix.Application.Parts.Dtos;
using Autofix.Application.Parts.Mapping;
using MediatR;

namespace Autofix.Application.Parts.Query.GetAllParts;

public sealed class GetPartsHandler(IPartRepository repository)
    : IRequestHandler<GetPartsQuery, IReadOnlyList<PartDto>>
{
    public async Task<IReadOnlyList<PartDto>> Handle(GetPartsQuery request, CancellationToken cancellationToken)
    {
        var parts = await repository.GetAllAsync(cancellationToken);
        return parts.Select(part => part.ToDto()).ToList();
    }
}
