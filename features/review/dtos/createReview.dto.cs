namespace backend.features.review.dtos;

using System;
using System.ComponentModel.DataAnnotations;

public class CreateReviewDto
{
    [Required]
    public string UserId { get; set; } = null!;

    [Required]
    public string BookId { get; set; } = null!;

    [Required]
    [Range(1, 5, ErrorMessage = "Rating must be between 1 and 5.")]
    public int Rating { get; set; }

    [StringLength(2000, ErrorMessage = "Review text cannot exceed 2000 characters.")]
    public string? ReviewText { get; set; }
}
