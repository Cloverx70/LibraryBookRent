using backend.features.booking.dtos;
using Microsoft.AspNetCore.Mvc;

namespace backend.features.booking;

[ApiController]
[Route("booking")]
public class BookingController : ControllerBase
{
    private readonly IBookingService _bookingService;

    public BookingController(IBookingService bookingService)
    {
        _bookingService = bookingService;
    }

    [HttpPost("book")]
    [JwtGuard]
    public async Task<IActionResult> BookABook([FromBody] BookABookDto body)
    {
        try
        {
            var result = await _bookingService.BookABook(body);
            return StatusCode(result.Code, result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new Res<string>(404, ex.Message));
        }
        catch (BadHttpRequestException ex)
        {
            return BadRequest(new Res<string>(400, ex.Message));
        }
        catch (Exception ex)
        {
            return StatusCode(500, new Res<string>(500, "An error occurred: " + ex.Message));
        }
    }

    [HttpPut("approve/{rid}")]
    [JwtGuard, AdminGuard]
    public async Task<IActionResult> ApproveRental([FromRoute] string rid)
    {
        var result = await _bookingService.ApproveRental(rid);
        return StatusCode(result.Code, result);
    }

    [HttpPut("decline/{rid}")]
    [JwtGuard, AdminGuard]
    public async Task<IActionResult> DeclineRental([FromRoute] string rid)
    {
        try
        {
            var result = await _bookingService.DeclineRental(rid);
            return StatusCode(result.Code, result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new Res<string>(404, ex.Message));
        }
        catch (BadHttpRequestException ex)
        {
            return BadRequest(new Res<string>(400, ex.Message));
        }
        catch (Exception ex)
        {
            return StatusCode(500, new Res<string>(500, "An error occurred: " + ex.Message));
        }
    }

    [HttpPut("return/{rid}")]
    [JwtGuard, AdminGuard]
    public async Task<IActionResult> ReturnABook([FromRoute] string rid)
    {
        try
        {
            var result = await _bookingService.ReturnABook(rid);
            return StatusCode(result.Code, result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new Res<string>(404, ex.Message));
        }
        catch (BadHttpRequestException ex)
        {
            return BadRequest(new Res<string>(400, ex.Message));
        }
        catch (Exception ex)
        {
            return StatusCode(500, new Res<string>(500, "An error occurred: " + ex.Message));
        }
    }

    [HttpGet("get-all")]
    [JwtGuard, AdminGuard]
    public async Task<IActionResult> GetAllRentals([FromQuery] string? query)
    {
        var result = await _bookingService.GetAllRentals(query);
        return StatusCode(
            result.Code,
            new { message = "Retrieved rentals successfully", data = result.Data }
        );
    }

    [HttpGet("get/{id}")]
    [JwtGuard, AdminGuard]
    public async Task<IActionResult> GetRentalById([FromRoute] string? id)
    {
        var result = await _bookingService.GetRentalById(id);
        return StatusCode(
            result.Code,
            new { message = "Retrieved rentals successfully", data = result.Data }
        );
    }
}
