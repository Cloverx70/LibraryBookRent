using backend.Models;

namespace backend.features.auth.dtos;

public class GetUserDto
{
    public string Id { get; set; }

    public required string FirstName { get; set; }

    public required string LastName { get; set; }

    public required string Email { get; set; }

    public string? PhoneNumber { get; set; }

    public string? Address { get; set; }

    public required string Username { get; set; }

    public string? StudentMajor { get; set; }

    public required string Role { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public List<Book> PendingRentals { get; set; } = [];
    public List<Book> ApprovedRentals { get; set; } = [];
    public List<Book> DeclinedRentals { get; set; } = [];
}
