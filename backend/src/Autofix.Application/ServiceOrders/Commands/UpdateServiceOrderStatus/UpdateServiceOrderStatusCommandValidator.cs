using Autofix.Domain.Enum;
using FluentValidation;

namespace Autofix.Application.ServiceOrders.Commands.UpdateServiceOrderStatus;

public sealed class UpdateServiceOrderStatusCommandValidator : AbstractValidator<UpdateServiceOrderStatusCommand>
{
    public UpdateServiceOrderStatusCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty();

        RuleFor(x => x.Status)
            .IsInEnum()
            .Must(status => status is >= ServiceOrderStatus.Created and <= ServiceOrderStatus.Completed);
    }
}
