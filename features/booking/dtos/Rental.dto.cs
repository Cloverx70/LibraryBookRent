using backend.features.auth.dtos;
using backend.Models;

namespace backend.features.booking.dtos;

public class RentalDto
{
    public required string Id { get; set; }
    public required GetUserDto User { get; set; }
    public required Book Book { get; set; }
    public DateTime? BorrowedAt { get; set; }
    public DateTime? ReturnDueDate { get; set; }
    public DateTime? ReturnedAt { get; set; }
    public string? Status { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.Now;
}
