using System.ComponentModel.DataAnnotations;

namespace backend.features.auth.dtos;

public class ResetPasswordRequestDto
{
    [Required(ErrorMessage = "Email is required")]
    [EmailAddress(ErrorMessage = "Invalid email")]
    public string Email { get; set; }
}
