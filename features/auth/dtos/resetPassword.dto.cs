using System.ComponentModel.DataAnnotations;

namespace backend.features.auth.dtos;

public class ResetPasswordDto
{
    [Required(ErrorMessage = "Token is required")]
    public required string Token { get; set; }

    [Required(ErrorMessage = "New Password is required")]
    [MinLength(8, ErrorMessage = "New Password should at least be 8 characters long")]
    public required string NewPassword { get; set; }

    [Required(ErrorMessage = "Confirm New Password is required")]
    [MinLength(8, ErrorMessage = "New Password should at least be 8 characters long")]
    public required string ConfirmNewPassword { get; set; }
}
