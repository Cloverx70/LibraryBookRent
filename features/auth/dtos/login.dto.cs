using System.ComponentModel.DataAnnotations;

namespace backend.features.auth.dtos;

public class LoginDto
{
    [Required(ErrorMessage = "email is required")]
    [EmailAddress(ErrorMessage = "invalid email format")]
    public required string Email { get; set; }

    [Required(ErrorMessage = "password is required")]
    [MinLength(8, ErrorMessage = "password must be at least 8 characters long")]
    public required string Password { get; set; }
}
