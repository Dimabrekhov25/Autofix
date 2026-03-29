using Autofix.Application.Common.Interfaces;
using Autofix.Application.Parts.Dtos;
using Autofix.Application.Parts.Mapping;
using MediatR;

namespace Autofix.Application.Parts.Query.GetPartsById;

public sealed class GetPartByIdHandler(IPartRepository repository)
    : IRequestHandler<GetPartByIdQuery, PartDto?>
{
    public async Task<PartDto?> Handle(GetPartByIdQuery request, CancellationToken cancellationToken)
    {
        var part = await repository.GetByIdAsync(request.Id, cancellationToken);
        return part is null ? null : part.ToDto();
    }
}
