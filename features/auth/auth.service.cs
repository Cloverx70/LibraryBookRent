using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using backend.features.auth.dtos;
using backend.Models;
using backend.utils.email;
using backend.utils.email.templates;
using BCrypt.Net;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace backend.features.auth
{
    public interface IAuthService
    {
        Task<string> Login(LoginDto loginDto);
        Task<Res<User>> Register(RegisterDto registerDto);
        string GenerateJwtToken(string userId, DateTime expirationDate);
        Task<Res<User>> RequestResetPassword(string email);
        Task<Res<User>> VerifyResetPassword(string token, string oldPassword, string newPassword);
    }

    public class AuthService : IAuthService
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly IHttpContextAccessor _httpContextAccessor;

        private readonly IemailService _emailService;

        public AuthService(
            ApplicationDbContext context,
            IConfiguration configuration,
            IHttpContextAccessor httpContextAccessor,
            IemailService emailService
        )
        {
            _context = context;
            _configuration = configuration;
            _httpContextAccessor = httpContextAccessor;
            _emailService = emailService;
        }

        public async Task<string> Login(LoginDto loginDto)
        {
            try
            {
                var tokenExist = _httpContextAccessor.HttpContext!.Request.Cookies["AuthToken"];

                if (tokenExist is not null)
                    throw new BadHttpRequestException(
                        "you need to log out before you log in again."
                    );

                var user =
                    await _context.Users.FirstOrDefaultAsync((u) => u.Email == loginDto.Email)
                    ?? throw new BadHttpRequestException("invalid email or password");

                if (user.FailedLoginAttempts >= 5)
                {
                    user.IsAccountLocked = true;
                    user.LockedAt = DateTime.Now;
                    user.LockedTime = 5;
                    user.FailedLoginAttempts = 0;
                    await _context.SaveChangesAsync();

                    throw new BadHttpRequestException(
                        $"you exceeded 5 login attempts, your account is now locked please try again in {user.LockedTime} hrs"
                    );
                }

                if (user.IsAccountLocked)
                {
                    DateTime lockedAt = (DateTime)user.LockedAt!;

                    if (DateTime.Now < lockedAt.AddHours(user.LockedTime ?? 0))
                    {
                        double timeLeftInHrs = (
                            lockedAt.AddHours(user.LockedTime ?? 0) - DateTime.Now
                        ).TotalHours;

                        throw new BadHttpRequestException(
                            $"your account is locked, try again in {Math.Ceiling(timeLeftInHrs)} hrs"
                        );
                    }

                    // Unlock the account if lock time has passed
                    user.IsAccountLocked = false;
                    user.FailedLoginAttempts = 0;
                    user.LockedAt = null;
                    user.LockedTime = 0;

                    await _context.SaveChangesAsync(); // Save changes to persist unlock status
                }
                if (!BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash))
                {
                    user.FailedLoginAttempts++;

                    await _context.SaveChangesAsync();

                    throw new BadHttpRequestException("invalid email or password");
                }

                user.FailedLoginAttempts = 0;

                await _context.SaveChangesAsync();

                string token = GenerateJwtToken(user.Id, DateTime.Now.AddDays(7));

                return token;
            }
            catch (Exception ex)
                when (ex is BadHttpRequestException || ex is UnauthorizedAccessException)
            {
                if (ex is BadHttpRequestException)
                    throw new BadHttpRequestException(ex.Message);

                if (ex is UnauthorizedAccessException)
                    throw new UnauthorizedAccessException(ex.Message);

                throw new Exception(ex.Message);
            }
        }

        public async Task<Res<User>> Register(RegisterDto registerDto)
        {
            try
            {
                var user = await _context.Users.FirstOrDefaultAsync(
                    (u) => u.Email == registerDto.Email
                );

                if (user is not null)
                    throw new BadHttpRequestException("user with same email already exists");

                var usernameExists = await _context.Users.FirstOrDefaultAsync(
                    (u) => u.Username == registerDto.Username
                );

                if (usernameExists is not null)
                    throw new BadHttpRequestException("user with same username already exists");

                User newUser = new User
                {
                    Id = Guid.NewGuid().ToString(),
                    Username = registerDto.Username,
                    FirstName = registerDto.FirstName,
                    LastName = registerDto.LastName,
                    Email = registerDto.Email,
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password),
                    StudentMajor = registerDto.StudentMajor,
                    Address = registerDto.Address,
                };

                _context.Users.Add(newUser);
                await _context.SaveChangesAsync();

                return new Res<User>(201, "registered successfully");
            }
            catch (Exception ex) when (ex is BadHttpRequestException)
            {
                if (ex is BadHttpRequestException)
                    throw new BadHttpRequestException(ex.Message);
                throw new Exception(ex.Message);
            }
        }

        public async Task<Res<User>> RequestResetPassword(string email)
        {
            try
            {
                var user = await _context.Users.FirstOrDefaultAsync((u) => u.Email == email);

                if (user is null)
                {
                    return new Res<User>(
                        200,
                        "If an account with this email exists, you will receive a password reset link shortly. Please check your inbox and spam folder."
                    );
                }

                string token = GenerateJwtToken(user.Id, DateTime.Now.AddMinutes(15));

                var ResetPasswordTemplate = new ResetPasswordTemplate();

                string resetLink =
                    $"{_configuration.GetSection("GeneralSettings")["FrontendUrl"]}/auth/reset-password/{token}";

                _emailService.sendEmail(
                    user.Email,
                    "Reset Password Request",
                    ResetPasswordTemplate.GetPasswordResetTemplate(user.Username, resetLink, "15"),
                    true
                );
                return new Res<User>(
                    200,
                    "If an account with this email exists, you will receive a password reset link shortly. Please check your inbox and spam folder."
                );
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<Res<User>> VerifyResetPassword(
            string token,
            string newPassword,
            string confirmNewPassword
        )
        {
            try
            {
                var claimsPrincipal =
                    ValidateToken(token, _configuration.GetSection("JwtSettings")["SecretKey"]!)
                    ?? throw new BadHttpRequestException("invalid token");

                string userId = GetClaimValue(
                    token,
                    _configuration.GetSection("JwtSettings")["SecretKey"]!,
                    ClaimTypes.NameIdentifier
                );

                var user =
                    await _context.Users.FirstOrDefaultAsync((u) => u.Id == userId)
                    ?? throw new BadHttpRequestException("invalid uid in token");

                if (newPassword.Length < 8)
                    throw new BadHttpRequestException(
                        "New Password should at least be 8 characters long"
                    );

                if (newPassword != confirmNewPassword)
                    throw new BadHttpRequestException(
                        "new and confirm new passwords does not match"
                    );

                if (BCrypt.Net.BCrypt.Verify(newPassword, user.PasswordHash))
                    throw new BadHttpRequestException("new password can't be you current password");

                user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(newPassword);

                await _context.SaveChangesAsync();

                var template = new PasswordChangedTemplate();
                string newToken = GenerateJwtToken(user.Id, DateTime.Now.AddDays(2));
                string newResetLink =
                    $"{_configuration.GetSection("GeneralSettings")["FrontendUrl"]}/auth/reset-password/{token}";

                _emailService.sendEmail(
                    user.Email,
                    "Your Password Has Been Changed",
                    template.GetPasswordChangedTemplate(user.Username, newResetLink),
                    true
                );

                return new Res<User>(200, "Please login to continue..");
            }
            catch (Exception ex) when (ex is BadHttpRequestException)
            {
                if (ex is BadHttpRequestException)
                    throw new BadHttpRequestException(ex.Message);

                throw new Exception(ex.Message);
            }
        }

        public string GenerateJwtToken(string userId, DateTime expirationDate)
        {
            var secretKey = _configuration["JwtSettings:SecretKey"]!;
            var issuer = _configuration["JwtSettings:Issuer"];
            var audience = _configuration["JwtSettings:Audience"];
            var key = Encoding.ASCII.GetBytes(secretKey);

            var tokenHandler = new JwtSecurityTokenHandler();
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(
                    new[] { new Claim(ClaimTypes.NameIdentifier, userId) }
                ),
                Expires = expirationDate,
                Issuer = issuer,
                Audience = audience,
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256Signature
                ),
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        public ClaimsPrincipal ValidateToken(string token, string secretKey)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(secretKey);

            var validationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = false, // Set to true if you have a valid issuer
                ValidateAudience = false, // Set to true if you have a valid audience
                ValidateLifetime = true, // Ensures token is not expired
                ClockSkew = TimeSpan.Zero, // Optional: Reduces allowed time difference
            };

            try
            {
                var principal = tokenHandler.ValidateToken(
                    token,
                    validationParameters,
                    out SecurityToken validatedToken
                );
                return principal;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Token validation failed: {ex.Message}");
                return null!;
            }
        }

        public string GetClaimValue(string token, string secretKey, string claimType)
        {
            var claimsPrincipal = ValidateToken(token, secretKey);
            return claimsPrincipal?.Claims.FirstOrDefault(c => c.Type == claimType)?.Value!;
        }
    }
}
