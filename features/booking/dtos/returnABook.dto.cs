using System.ComponentModel.DataAnnotations;

namespace backend.features.booking.dtos;

public class ReturnABookDto
{
    [Required]
    [Length(36, 36)]
    public string UserId { get; set; } = null!;

    [Required]
    [Length(36, 36)]
    public string BookId { get; set; } = null!;
}
