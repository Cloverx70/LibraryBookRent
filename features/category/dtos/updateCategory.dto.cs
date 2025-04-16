using System;
using System.ComponentModel.DataAnnotations;

namespace backend.features.category.dtos;

public class UpdateCategoryDto
{
    [MaxLength(100)]
    public string? Name { get; set; }

    [MaxLength(500)]
    public string? Description { get; set; }

    public List<string>? NewBookIds { get; set; }

    public List<string>? KeptBookIds { get; set; }
}
