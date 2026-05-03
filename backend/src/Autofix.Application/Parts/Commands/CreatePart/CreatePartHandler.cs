using Autofix.Application.Common.Interfaces;
using Autofix.Application.Parts.Dtos;
using Autofix.Application.Parts.Mapping;
using Autofix.Domain.Entities.Inventory;
using MediatR;

namespace Autofix.Application.Parts.Commands.CreatePart;

/// <summary>
/// Builds a <see cref="Part"/> aggregate and persists it via the repository.
/// </summary>
public sealed class CreatePartHandler(IPartRepository repository)
    : IRequestHandler<CreatePartCommand, PartDto>
{
    /// <inheritdoc />
    public async Task<PartDto> Handle(CreatePartCommand request, CancellationToken cancellationToken)
    {
        var part = new Part
        {
            Name = request.Name,
            UnitPrice = request.UnitPrice,
            IsActive = request.IsActive
        };

        var saved = await repository.AddAsync(part, cancellationToken);
        return saved.ToDto();
    }
}
