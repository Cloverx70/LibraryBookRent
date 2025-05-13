using System.ComponentModel.DataAnnotations;
using System.Runtime.Serialization;

namespace backend.features.booking.dtos;

public class BookABookDto
{
    [Required]
    [Length(36, 36)]
    public string UserId { get; set; } = null!;

    [Required]
    [Length(36, 36)]
    public string BookId { get; set; } = null!;
}

public class RentalStatus
{
    public static readonly string approved = "approved";
    public static readonly string pending = "pending";
    public static readonly string declined = "declined";
    public static readonly string returned = "returned";
}
