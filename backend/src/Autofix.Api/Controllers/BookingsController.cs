using Autofix.Api.Models;
using Autofix.Application.Bookings.Commands.CreateBooking;
using Autofix.Application.Bookings.Commands.DeleteBooking;
using Autofix.Application.Bookings.Commands.UpdateBooking;
using Autofix.Application.Bookings.Queries.GetBookingById;
using Autofix.Application.Bookings.Queries.GetBookings;
using Autofix.Application.Bookings.Results;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Autofix.Api.Controllers;

public sealed class BookingsController(IMediator mediator) : BaseController
{
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateBookingCommand command, CancellationToken cancellationToken)
    {
        var result = await mediator.Send(command, cancellationToken);
        return ToMutationResult(result);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
    {
        var result = await mediator.Send(new GetBookingsQuery(), cancellationToken);
        return OkResult(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
    {
        var result = await mediator.Send(new GetBookingByIdQuery(id), cancellationToken);

        if (result is null)
        {
            return NotFound(ApiResult.Failure($"Booking {id} not found"));
        }

        return OkResult(result);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(
        Guid id,
        [FromBody] UpdateBookingCommand command,
        CancellationToken cancellationToken)
    {
        if (id != command.Id)
        {
            return BadRequestResult("Route id does not match body id.");
        }

        var result = await mediator.Send(command, cancellationToken);
        return ToMutationResult(result, id);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var deleted = await mediator.Send(new DeleteBookingCommand(id), cancellationToken);

        if (!deleted)
        {
            return NotFound(ApiResult.Failure($"Booking {id} not found"));
        }

        return OkResult(new { });
    }

    private IActionResult ToMutationResult(BookingMutationResult result, Guid? bookingId = null)
    {
        if (result.Booking is not null && result.Error == BookingMutationError.None)
        {
            return OkResult(result.Booking);
        }

        return result.Error switch
        {
            BookingMutationError.BookingNotFound => NotFound(ApiResult.Failure(
                bookingId.HasValue
                    ? $"Booking {bookingId.Value} not found"
                    : "Booking not found")),
            BookingMutationError.CustomerNotFound => NotFound(ApiResult.Failure("Customer not found")),
            BookingMutationError.VehicleNotFound => NotFound(ApiResult.Failure("Vehicle not found")),
            BookingMutationError.VehicleDoesNotBelongToCustomer => BadRequest(ApiResult.Failure("Vehicle does not belong to customer")),
            BookingMutationError.ServiceCatalogItemsNotFound => BadRequest(ApiResult.Failure("One or more service catalog items were not found")),
            BookingMutationError.TimeSlotUnavailable => Conflict(ApiResult.Failure("Selected time slot is unavailable")),
            _ => BadRequest(ApiResult.Failure("Booking request could not be processed"))
        };
    }
}
