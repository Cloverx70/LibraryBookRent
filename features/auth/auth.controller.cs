using backend.features.auth.dtos;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.features.auth;

[ApiController()]
[Route("auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly IConfiguration _configuration;
    private readonly ApplicationDbContext _context;

    public AuthController(
        IAuthService authService,
        IConfiguration configuration,
        ApplicationDbContext context
    )
    {
        _authService = authService;
        _configuration = configuration;
        _context = context;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
    {
        try
        {
            string token = await _authService.Login(loginDto);

            Boolean isInProduction = Boolean.Parse(
                _configuration.GetSection("GeneralSettings")["inProduction"]!
            );

            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = isInProduction,
                SameSite = SameSiteMode.Lax,
                Expires = DateTime.UtcNow.AddDays(7),
            };

            Response.Cookies.Append("AuthToken", token, cookieOptions);
            return Ok(new { message = "logged in successfully" });
        }
        catch (BadHttpRequestException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = ex.Message });
        }
    }

    [HttpPost("logout")]
    public IActionResult Logout()
    {
        // Delete the AuthToken cookie
        Response.Cookies.Delete("AuthToken");

        return Ok(new { message = "Logged out successfully" });
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
    {
        try
        {
            var response = await _authService.Register(registerDto);
            return StatusCode(response.Code, new { message = response.Message });
        }
        catch (BadHttpRequestException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = ex.Message });
        }
    }

    [HttpGet("status")]
    [JwtGuard]
    public async Task<IActionResult> GetProtectedData()
    {
        var userId = HttpContext.Items["UserId"] as string;

        if (userId == null)
        {
            return Unauthorized(new { message = "User ID not found in context" });
        }
        var user = await _context
            .Users.Where(u => u.Id == userId)
            .Select(u => new GetUserDto
            {
                Id = u.Id,
                FirstName = u.FirstName,
                LastName = u.LastName,
                Email = u.Email,
                PhoneNumber = u.PhoneNumber,
                Address = u.Address,
                Username = u.Username,
                StudentMajor = u.StudentMajor,
                Role = u.Role,
                CreatedAt = u.CreatedAt,
                UpdatedAt = u.UpdatedAt,
                PendingRentals = _context
                    .UserBookedBooks.Where(ub =>
                        ub.UserId == u.Id && ub.Status == RentalStatus.pending
                    )
                    .Select(ub => ub.Book)
                    .ToList(),

                ApprovedRentals = _context
                    .UserBookedBooks.Where(ub =>
                        ub.UserId == u.Id && ub.Status == RentalStatus.approved
                    )
                    .Select(ub => ub.Book)
                    .ToList(),

                DeclinedRentals = _context
                    .UserBookedBooks.Where(ub =>
                        ub.UserId == u.Id && ub.Status == RentalStatus.declined
                    )
                    .Select(ub => ub.Book)
                    .ToList(),
            })
            .FirstOrDefaultAsync();

        return Ok(new { message = "Access granted", user });
    }

    [HttpPost("update")]
    [JwtGuard]
    public async Task<IActionResult> UpdateAccount([FromBody] EditUserDto body)
    {
        try
        {
            var userId = HttpContext.Items["UserId"] as string;

            if (userId == null)
            {
                return Unauthorized(new { message = "User ID not found in context" });
            }

            var response = await _authService.UpdateAccount(userId, body);

            return StatusCode(response.Code, new { message = response.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = ex.Message });
        }
    }

    [HttpPost("contact-us")]
    [JwtGuard]
    public async Task<IActionResult> ContactUs([FromBody] ContactUsDto dto)
    {
        var result = await _authService.ContactUs(dto.Email, dto.Message);
        return StatusCode(result.Code, result.Message);
    }

    // Reset Password Feature :

    [HttpPost("req-reset-password")]
    public async Task<IActionResult> RequestResetPassword([FromBody] ResetPasswordRequestDto body)
    {
        try
        {
            var response = await _authService.RequestResetPassword(body.Email);

            return StatusCode(response.Code, new { message = response.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = ex.Message });
        }
    }

    [HttpPost("verify-reset-password")]
    public async Task<IActionResult> VerifyResetPassword([FromBody] ResetPasswordDto body)
    {
        try
        {
            var response = await _authService.VerifyResetPassword(
                body.Token,
                body.NewPassword,
                body.ConfirmNewPassword
            );

            return StatusCode(response.Code, new { message = response.Message });
        }
        catch (BadHttpRequestException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = ex.Message });
        }
    }
}
