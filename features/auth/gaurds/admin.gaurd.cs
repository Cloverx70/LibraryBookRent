using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using backend.Models; // Replace with your actual namespace
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

public class AdminGuardAttribute : Attribute, IAsyncAuthorizationFilter
{
    public async Task OnAuthorizationAsync(AuthorizationFilterContext context)
    {
        var httpContext = context.HttpContext;
        var token = httpContext.Request.Cookies["AuthToken"];

        if (string.IsNullOrEmpty(token))
        {
            context.Result = new UnauthorizedObjectResult(new { message = "Token is required" });
            return;
        }

        try
        {
            var handler = new JwtSecurityTokenHandler();
            var jwtToken = handler.ReadJwtToken(token);

            var userIdClaim = jwtToken.Claims.FirstOrDefault(c => c.Type == "nameid")?.Value;

            if (userIdClaim == null)
            {
                context.Result = new UnauthorizedObjectResult(
                    new { message = "Invalid token: user ID claim missing" }
                );
                return;
            }

            var dbContext =
                httpContext.RequestServices.GetService(typeof(ApplicationDbContext))
                as ApplicationDbContext;

            if (dbContext == null)
            {
                context.Result = new StatusCodeResult(StatusCodes.Status500InternalServerError);
                return;
            }

            var user = await dbContext.Users.FindAsync(userIdClaim);

            if (user == null)
            {
                context.Result = new NotFoundObjectResult(new { message = "User not found" });
                return;
            }

            if (user.Role.ToLower() != "admin")
            {
                context.Result = new ForbidResult(); // 403 Forbidden
                return;
            }

            httpContext.Items["UserId"] = user.Id;
        }
        catch (Exception ex)
        {
            context.Result = new UnauthorizedObjectResult(
                new { message = $"Invalid token format: {ex.Message}" }
            );
        }
    }
}
