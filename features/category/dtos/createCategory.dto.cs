using System;
using System.ComponentModel.DataAnnotations;

namespace backend.features.category.dtos;

public class CreateCategoryDto
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = null!;

    [MaxLength(500)]
    public string? Description { get; set; }

    public List<string>? BookIds { get; set; }
}
