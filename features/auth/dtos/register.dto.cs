namespace backend.features.auth.dtos;

using System.ComponentModel.DataAnnotations;

public class RegisterDto
{
    [Required(ErrorMessage = "Username is required.")]
    [StringLength(50, ErrorMessage = "Username must be at most 50 characters.")]
    public string Username { get; set; } = null!;

    [Required(ErrorMessage = "First name is required.")]
    [StringLength(50, ErrorMessage = "First name must be at most 50 characters.")]
    public string FirstName { get; set; } = null!;

    [Required(ErrorMessage = "Last name is required.")]
    [StringLength(50, ErrorMessage = "Last name must be at most 50 characters.")]
    public string LastName { get; set; } = null!;

    [Required(ErrorMessage = "Email is required.")]
    [EmailAddress(ErrorMessage = "Invalid email format.")]
    public string Email { get; set; } = null!;

    [Required(ErrorMessage = "Password is required.")]
    [MinLength(8, ErrorMessage = "Password must be at least 8 characters long.")]
    public string Password { get; set; } = null!;

    [Required(ErrorMessage = "Student major is required.")]
    [StringLength(100, ErrorMessage = "Student major must be at most 100 characters.")]
    public string StudentMajor { get; set; } = null!;

    [StringLength(255, ErrorMessage = "Address must be at most 255 characters.")]
    public string? Address { get; set; }
}
