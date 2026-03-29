using FluentValidation;

namespace Autofix.Application.Vehicles.Commands.DeleteVehicle;

public sealed class DeleteVehicleCommandValidator : AbstractValidator<DeleteVehicleCommand>
{
    public DeleteVehicleCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty();
    }
}
