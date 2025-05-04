using backend.features.book.dtos;

namespace backend.features.category.dtos
{
    public class GetCategoryDto
    {
        public string Id { get; set; } = null!;
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public DateTime? CreatedAt { get; set; }
        public List<BookDto> Books { get; set; } = new();
    }
}
