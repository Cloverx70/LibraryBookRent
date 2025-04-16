using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.features.book.dtos;
using backend.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace backend.features.book
{
    [ApiController]
    [Route("book")]
    public class bookController : ControllerBase
    {
        private readonly IBookService _bookService;

        public bookController(IBookService bookService)
        {
            _bookService = bookService;
        }

        [HttpPost("create")]
        [JwtGuard, AdminGuard]
        public async Task<IActionResult> CreateBook([FromForm] createBookDto body)
        {
            try
            {
                var response = await _bookService.CreateBook(body);

                return Ok(new { message = response.Message });
            }
            catch (Exception ex)
                when (ex is ArgumentException
                    || ex is KeyNotFoundException
                    || ex is BadHttpRequestException
                )
            {
                switch (ex)
                {
                    case KeyNotFoundException _:
                        return NotFound(new { message = ex.Message });

                    case BadHttpRequestException _:
                        return BadRequest(new { message = ex.Message });

                    default:
                        return BadRequest(new { message = ex.Message });
                }
            }
            catch (Exception ex)
            {
                // Handle any other exceptions that are not specifically handled
                return StatusCode(
                    500,
                    new { message = "An unexpected error occurred", details = ex.Message }
                );
            }
        }

        [HttpPut("update/{id}")]
        [JwtGuard, AdminGuard]
        public async Task<IActionResult> UpdateBook(
            [FromRoute] string id,
            [FromForm] UpdateBookDto body
        )
        {
            try
            {
                var response = await _bookService.UpdateBookById(id, body);

                return Ok(new { message = response.Message });
            }
            catch (Exception ex)
                when (ex is ArgumentException
                    || ex is KeyNotFoundException
                    || ex is BadHttpRequestException
                )
            {
                switch (ex)
                {
                    case KeyNotFoundException _:
                        return NotFound(new { message = ex.Message });

                    case BadHttpRequestException _:
                        return BadRequest(new { message = ex.Message });

                    default:
                        return BadRequest(new { message = ex.Message });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(
                    500,
                    new { message = "An unexpected error occurred", details = ex.Message }
                );
            }
        }

        [HttpDelete("delete/{id}")]
        [JwtGuard, AdminGuard]
        public async Task<IActionResult> DeleteBook([FromRoute] string id)
        {
            try
            {
                var response = await _bookService.DeleteBookById(id);

                return Ok(new { message = response.Message });
            }
            catch (Exception ex)
                when (ex is ArgumentException
                    || ex is KeyNotFoundException
                    || ex is BadHttpRequestException
                )
            {
                switch (ex)
                {
                    case KeyNotFoundException _:
                        return NotFound(new { message = ex.Message });

                    case BadHttpRequestException _:
                        return BadRequest(new { message = ex.Message });

                    default:
                        return BadRequest(new { message = ex.Message });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(
                    500,
                    new { message = "An unexpected error occurred", details = ex.Message }
                );
            }
        }

        [HttpGet("get/{id}")]
        public async Task<IActionResult> GetBookById([FromRoute] string id)
        {
            try
            {
                var response = await _bookService.GetBookById(id);

                return Ok(new { message = response.Message, data = response.Data });
            }
            catch (Exception ex)
                when (ex is ArgumentException
                    || ex is KeyNotFoundException
                    || ex is BadHttpRequestException
                )
            {
                switch (ex)
                {
                    case KeyNotFoundException _:
                        return NotFound(new { message = ex.Message });

                    case BadHttpRequestException _:
                        return BadRequest(new { message = ex.Message });

                    default:
                        return BadRequest(new { message = ex.Message });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(
                    500,
                    new { message = "An unexpected error occurred", details = ex.Message }
                );
            }
        }

        [HttpGet("get-all")]
        public async Task<IActionResult> GetAllBooksBySearchSortAndFilter(
            [FromQuery] string? query,
            [FromQuery] FilterBooksDto filter,
            [FromQuery] string? sort
        )
        {
            sort ??= "date-desc";

            try
            {
                var response = await _bookService.GetAllBooksBySearchSortAndFilter(
                    filter,
                    sort,
                    query
                );

                return Ok(new { message = response.Message, data = response.Data });
            }
            catch (Exception ex)
                when (ex is ArgumentException
                    || ex is KeyNotFoundException
                    || ex is BadHttpRequestException
                )
            {
                switch (ex)
                {
                    case KeyNotFoundException _:
                        return NotFound(new { message = ex.Message });

                    case BadHttpRequestException _:
                        return BadRequest(new { message = ex.Message });

                    default:
                        return BadRequest(new { message = ex.Message });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(
                    500,
                    new { message = "An unexpected error occurred", details = ex.Message }
                );
            }
        }
    }
}
