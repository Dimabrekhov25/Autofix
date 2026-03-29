using Autofix.Application.Common.Interfaces;
using Autofix.Application.Parts.Dtos;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace Autofix.Application.Parts.Queries.GetPartById;

public sealed class GetPartByIdHandler(IPartRepository repository)
    : IRequestHandler<GetPartByIdQuery, PartDto?>
{
    public async Task<PartDto?> Handle(GetPartByIdQuery request, CancellationToken cancellationToken)
    {
        var part = await repository.GetByIdAsync(request.Id, cancellationToken);

        if (part is null)
        {
            return null;
        }

        return new PartDto(
            part.Id,
            part.Name,
            part.UnitPrice,
            part.IsActive
        );
    }
}