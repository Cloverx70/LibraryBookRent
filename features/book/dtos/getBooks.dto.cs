using System.ComponentModel.DataAnnotations;

namespace backend.features.book.dtos;

public enum BookGenre
{
    Fiction,
    NonFiction,
    Fantasy,
    Mystery,
    Romance,
    ScienceFiction,
    Thriller,
}

public class FilterBooksDto
{
    public Boolean? IsAvailable { set; get; } = false;
    public string? CategoryId { set; get; } = string.Empty;
    public string? Genre { set; get; } = null;
}
