using Autofix.Application.Common.Interfaces;
using Autofix.Application.Parts.Dtos;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Autofix.Application.Parts.Commands.UpdatePart;

public sealed class UpdatePartHandler(IPartRepository repository)
    : IRequestHandler<UpdatePartCommand, PartDto?>
{
    public async Task<PartDto?> Handle(UpdatePartCommand request, CancellationToken cancellationToken)
    {
        var part = await repository.GetByIdAsync(request.Id, cancellationToken);

        if (part is null)
        {
            return null;
        }

        part.Name = request.Name;
        part.UnitPrice = request.UnitPrice;
        part.IsActive = request.IsActive;
        part.UpdatedAt = DateTime.UtcNow; 

        await repository.UpdateAsync(part, cancellationToken);

        return new PartDto(
            part.Id,
            part.Name,
            part.UnitPrice,
            part.IsActive
        );
    }
}