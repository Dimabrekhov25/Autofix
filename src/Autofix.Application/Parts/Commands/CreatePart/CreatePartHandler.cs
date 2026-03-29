using Autofix.Application.Common.Interfaces;
using Autofix.Application.Parts.Dtos;
using Autofix.Domain.Entities.Inventory;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace Autofix.Application.Parts.Commands.CreatePart;

public sealed class CreatePartHandler(
    IPartRepository repository)
    : IRequestHandler<CreatePartCommand, PartDto>
{
    public async Task<PartDto> Handle(CreatePartCommand request, CancellationToken cancellationToken)
    {
        var part = new Part
        {
            Name = request.Name,
            UnitPrice = request.UnitPrice,
            IsActive = request.IsActive
        };

        var saved = await repository.AddAsync(part, cancellationToken);

        return new PartDto(
            saved.Id,
            saved.Name,
            saved.UnitPrice,
            saved.IsActive
        );
    }
}