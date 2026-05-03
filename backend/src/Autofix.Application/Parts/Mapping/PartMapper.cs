using Autofix.Application.Parts.Dtos;
using Autofix.Domain.Entities.Inventory;

namespace Autofix.Application.Parts.Mapping;

/// <summary>
/// Maps domain <see cref="Part"/> to <see cref="PartDto"/>.
/// </summary>
public static class PartMapper
{
    /// <summary>Projects entity fields into a DTO.</summary>
    public static PartDto ToDto(this Part entity)
        => new(entity.Id, entity.Name, entity.UnitPrice, entity.IsActive);
}
