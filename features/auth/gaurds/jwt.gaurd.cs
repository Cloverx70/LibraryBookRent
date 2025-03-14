using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using Google.Protobuf.WellKnownTypes;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

public class JwtGuardAttribute : Attribute, IAuthorizationFilter
{
    public void OnAuthorization(AuthorizationFilterContext context)
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

            // Find the user ID claim
            var userIdClaim = jwtToken.Claims.FirstOrDefault(c => c.Type == "nameid")?.Value;

            if (userIdClaim == null)
            {
                context.Result = new UnauthorizedObjectResult(
                    new { message = "Invalid token: user ID claim missing" }
                );
                return;
            }

            httpContext.Items["UserId"] = userIdClaim;
        }
        catch (Exception ex)
        {
            context.Result = new UnauthorizedObjectResult(
                new { message = $"Invalid token format: {ex.Message}" }
            );
        }
    }
}
