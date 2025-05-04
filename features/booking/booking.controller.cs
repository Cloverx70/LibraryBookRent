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

    [HttpPost("approve")]
    [JwtGuard, AdminGuard]
    public async Task<IActionResult> ApproveRental([FromBody] BookABookDto dto)
    {
        var result = await _bookingService.ApproveRental(dto);
        return StatusCode(result.Code, result);
    }

    [HttpPost("decline")]
    [JwtGuard, AdminGuard]
    public async Task<IActionResult> DeclineRental([FromBody] BookABookDto dto)
    {
        var result = await _bookingService.DeclineRental(dto);
        return StatusCode(result.Code, result);
    }

    [HttpPost("return")]
    [JwtGuard, AdminGuard]
    public async Task<IActionResult> ReturnABook([FromBody] ReturnABookDto body)
    {
        try
        {
            var result = await _bookingService.ReturnABook(body);
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
}
