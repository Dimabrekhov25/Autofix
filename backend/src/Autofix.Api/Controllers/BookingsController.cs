using Autofix.Api.Models;
using Autofix.Application.Bookings.Commands.CreateBooking;
using Autofix.Application.Bookings.Commands.DeleteBooking;
using Autofix.Application.Bookings.Commands.UpdateBooking;
using Autofix.Application.Bookings.Queries.GetAvailableBookingSlots;
using Autofix.Application.Bookings.Queries.GetBookingById;
using Autofix.Application.Bookings.Queries.GetBookingQuote;
using Autofix.Application.Bookings.Queries.GetBookings;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Autofix.Api.Controllers;

public sealed class BookingsController(IMediator mediator) : BaseController
{
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateBookingCommand command, CancellationToken cancellationToken)
    {
        var result = await mediator.Send(command, cancellationToken);
        return OkResult(result);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] GetBookingsQuery query, CancellationToken cancellationToken)
    {
        var result = await mediator.Send(query, cancellationToken);
        return OkResult(result);
    }

    [HttpPost("quote")]
    public async Task<IActionResult> GetQuote(
        [FromBody] GetBookingQuoteQuery query,
        CancellationToken cancellationToken)
    {
        var result = await mediator.Send(query, cancellationToken);
        return OkResult(result);
    }

    [HttpGet("slots")]
    public async Task<IActionResult> GetAvailableSlots(
        [FromQuery] GetAvailableBookingSlotsQuery query,
        CancellationToken cancellationToken)
    {
        var result = await mediator.Send(query, cancellationToken);
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

        if (result is null)
        {
            return NotFound(ApiResult.Failure($"Booking {id} not found"));
        }

        return OkResult(result);
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
}
