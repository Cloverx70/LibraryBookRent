using System.ComponentModel.DataAnnotations;

namespace backend.features.book.dtos;

public class createBookDto
{
    [Required(ErrorMessage = "title is required")]
    [MinLength(10, ErrorMessage = "book title should be at least 10 characters")]
    public required string Title { get; set; } = null!;

    [Required(ErrorMessage = "author is required")]
    public required string Author { get; set; } = null!;

    [Required(ErrorMessage = "isbn is required")]
    [StringLength(
        17,
        ErrorMessage = "ISBN length should be exactly 17 characters, including hyphens"
    )]
    public required string Isbn { get; set; } = null!;

    [Required(ErrorMessage = "Description is required")]
    [MinLength(20, ErrorMessage = "book description should be at least 20 characters")]
    public required string Description { get; set; }

    [FileValidation(new[] { ".jpeg", ".jpg", ".png" }, 5)]
    public required IFormFile File { get; set; }

    public string? CategoryId { get; set; }

    [Required(ErrorMessage = "total copies is required")]
    public required int TotalCopies { get; set; }

    [Required(ErrorMessage = "available copies is required")]
    public required int AvailableCopies { get; set; }
}
