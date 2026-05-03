using FluentValidation;

namespace Autofix.Application.Vehicles.Commands.DeleteVehicle;

/// <summary>
/// Validation for <see cref="DeleteVehicleCommand"/>.
/// </summary>
public sealed class DeleteVehicleCommandValidator : AbstractValidator<DeleteVehicleCommand>
{
    /// <summary>
    /// Configures validation rules applied before the handler runs.
    /// </summary>
    public DeleteVehicleCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty();
    }
}
