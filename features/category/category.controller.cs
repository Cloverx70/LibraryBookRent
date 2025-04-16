using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.features.category.dtos;
using Microsoft.AspNetCore.Mvc;

namespace backend.features.category
{
    [ApiController]
    [Route("category")]
    public class categoryController : ControllerBase
    {
        private readonly ICategoryService _categoryService;

        public categoryController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        [HttpPost("create")]
        [JwtGuard, AdminGuard]
        public async Task<IActionResult> CreateCategory(
            [FromBody] CreateCategoryDto createCategoryDto
        )
        {
            try
            {
                var response = await _categoryService.CreateCategory(createCategoryDto);

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
        }

        [HttpPut("update/{id}")]
        [JwtGuard, AdminGuard]
        public async Task<IActionResult> UpdateCategory(
            [FromRoute] string Id,
            [FromBody] UpdateCategoryDto updateCategoryDto
        )
        {
            try
            {
                var response = await _categoryService.UpdateCategory(Id, updateCategoryDto);

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
        }

        [HttpDelete("delete/{id}")]
        [JwtGuard, AdminGuard]
        public async Task<IActionResult> DeleteCategory([FromRoute] string Id)
        {
            try
            {
                var response = await _categoryService.DeleteCategory(Id);

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
        }

        [HttpGet("get/{id}")]
        public async Task<IActionResult> GetCategoryById([FromRoute] string Id)
        {
            try
            {
                var response = await _categoryService.GetCategoryById(Id);

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
        }

        [HttpGet("get-all")]
        public async Task<IActionResult> GetAllCategories()
        {
            try
            {
                var response = await _categoryService.GetAllCategories();

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
        }
    }
}
