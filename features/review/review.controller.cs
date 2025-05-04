using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using backend.features.review.dtos;
using backend.Models;
using backend.utils;
using Microsoft.AspNetCore.Mvc;

namespace backend.features.review
{
    [ApiController]
    [Route("review")]
    public class ReviewController : ControllerBase
    {
        private readonly IReviewService _reviewService;

        public ReviewController(IReviewService reviewService)
        {
            _reviewService = reviewService;
        }

        [HttpPost("create")]
        [JwtGuard]
        public async Task<IActionResult> CreateReview([FromBody] CreateReviewDto createReviewDto)
        {
            try
            {
                var response = await _reviewService.CreateReview(createReviewDto);
                return StatusCode(response.Code, new { message = response.Message });
            }
            catch (Exception ex) when (ex is KeyNotFoundException || ex is BadHttpRequestException)
            {
                return ex switch
                {
                    KeyNotFoundException => NotFound(new { message = ex.Message }),
                    BadHttpRequestException => BadRequest(new { message = ex.Message }),
                    _ => BadRequest(new { message = ex.Message }),
                };
            }
        }

        [HttpPut("update/{rid}")]
        [JwtGuard]
        public async Task<IActionResult> UpdateReview(
            [FromRoute] string rid,
            [FromBody] UpdateReviewDto updateReviewDto
        )
        {
            try
            {
                var response = await _reviewService.UpdateReview(rid, updateReviewDto);
                return StatusCode(response.Code, new { message = response.Message });
            }
            catch (Exception ex) when (ex is KeyNotFoundException || ex is BadHttpRequestException)
            {
                return ex switch
                {
                    KeyNotFoundException => NotFound(new { message = ex.Message }),
                    BadHttpRequestException => BadRequest(new { message = ex.Message }),
                    _ => BadRequest(new { message = ex.Message }),
                };
            }
        }

        [HttpDelete("delete/{rid}")]
        [JwtGuard]
        public async Task<IActionResult> DeleteReview([FromRoute] string rid)
        {
            try
            {
                var response = await _reviewService.DeleteReview(rid);
                return StatusCode(response.Code, new { message = response.Message });
            }
            catch (Exception ex) when (ex is KeyNotFoundException || ex is BadHttpRequestException)
            {
                return ex switch
                {
                    KeyNotFoundException => NotFound(new { message = ex.Message }),
                    BadHttpRequestException => BadRequest(new { message = ex.Message }),
                    _ => BadRequest(new { message = ex.Message }),
                };
            }
        }

        [HttpGet("get/{bid}")]
        public async Task<IActionResult> GetBookReviews([FromRoute] string bid)
        {
            try
            {
                var response = await _reviewService.GetBookReviews(bid);
                return Ok(new { message = response.Message, data = response.Data });
            }
            catch (Exception ex) when (ex is KeyNotFoundException || ex is BadHttpRequestException)
            {
                return ex switch
                {
                    KeyNotFoundException => NotFound(new { message = ex.Message }),
                    BadHttpRequestException => BadRequest(new { message = ex.Message }),
                    _ => BadRequest(new { message = ex.Message }),
                };
            }
        }
    }
}
