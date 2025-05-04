namespace backend.features.auth.dtos;

using System.ComponentModel.DataAnnotations;

public class EditUserDto
{
    [StringLength(50, ErrorMessage = "Username must be at most 50 characters.")]
    public string? Username { get; set; }

    [StringLength(50, ErrorMessage = "First name must be at most 50 characters.")]
    public string? FirstName { get; set; }

    [StringLength(50, ErrorMessage = "Last name must be at most 50 characters.")]
    public string? LastName { get; set; }

    [EmailAddress(ErrorMessage = "Invalid email format.")]
    public string? Email { get; set; }

    [StringLength(100, ErrorMessage = "Student major must be at most 100 characters.")]
    public string? StudentMajor { get; set; }

    [StringLength(255, ErrorMessage = "Address must be at most 255 characters.")]
    public string? Address { get; set; }

    [StringLength(8, ErrorMessage = "Phone Number must be at most 8 characters.")]
    public string? PhoneNumber { get; set; }
}
