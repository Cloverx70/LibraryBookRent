using backend.features.book.dtos;
using backend.features.category.dtos;
using backend.Models;
using backend.utils;
using Microsoft.EntityFrameworkCore;

namespace backend.features.category;

public interface ICategoryService
{
    public Task<Res<Category>> CreateCategory(CreateCategoryDto createCategoryDto);
    public Task<Res<Category>> UpdateCategory(string Id, UpdateCategoryDto updateCategoryDto);
    public Task<Res<Category>> DeleteCategory(string Id);
    public Task<Res<GetCategoryDto>> GetCategoryById(string Id);
    public Task<Res<List<GetCategoryDto>>> GetAllCategories();
}

public class CategoryService : ICategoryService
{
    public readonly ApplicationDbContext _context;

    public CategoryService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Res<Category>> CreateCategory(CreateCategoryDto body)
    {
        try
        {
            var existingCategory = await _context.Categories.FirstOrDefaultAsync(c =>
                c.Name == body.Name
            );

            if (existingCategory is not null)
                throw new KeyNotFoundException("Category with the same name already exists");

            var newCategory = new Category
            {
                Id = Guid.NewGuid().ToString(),
                Name = body.Name,
                Description = body.Description,
            };

            _context.Categories.Add(newCategory);

            if (body.BookIds is not null && body.BookIds.Count > 0)
            {
                // Step 1: Validate BookIds
                var validBookIds = await _context
                    .Books.Where(b => body.BookIds.Contains(b.Id))
                    .Select(b => b.Id)
                    .ToListAsync();

                var invalidBookIds = body.BookIds.Except(validBookIds).ToList();

                if (invalidBookIds.Count > 0)
                    throw new BadHttpRequestException(
                        $"Invalid BookIds: {string.Join(", ", invalidBookIds)}"
                    );

                // Step 2: Avoid duplicates in CategoryBooks
                var existingBookIds = await _context
                    .CategoryBooks.Where(cb =>
                        validBookIds.Contains(cb.BookId) && cb.CategoryId == newCategory.Id
                    )
                    .Select(cb => cb.BookId)
                    .ToListAsync();

                var newBookIds = validBookIds.Except(existingBookIds).ToList();

                foreach (var validId in newBookIds)
                {
                    var Book = await _context.Books.FirstOrDefaultAsync((b) => b.Id == validId);

                    if (Book!.CategoryId is not null)
                        throw new BadHttpRequestException(
                            $"Book {Book.Title} is already existing in another category"
                        );

                    Book!.CategoryId = newCategory.Id;
                }

                var categoryBooks = newBookIds
                    .Select(id => new CategoryBook
                    {
                        Id = Guid.NewGuid().ToString(),
                        CategoryId = newCategory.Id,
                        BookId = id,
                    })
                    .ToList();

                _context.CategoryBooks.AddRange(categoryBooks);
            }

            await _context.SaveChangesAsync();

            return new Res<Category>(201, "Category created successfully");
        }
        catch (Exception ex) when (ex is KeyNotFoundException || ex is BadHttpRequestException)
        {
            throw ex; // already typed exceptions
        }
    }

    public async Task<Res<Category>> UpdateCategory(string Id, UpdateCategoryDto body)
    {
        try
        {
            var Category =
                await _context.Categories.FirstOrDefaultAsync(c => c.Id == Id)
                ?? throw new KeyNotFoundException("Category not found");

            UtilsMethods.PatchEntity(Category, body);

            // Handle deletion of unkept books
            if (body.KeptBookIds is not null)
            {
                var CategoryBookIds = await _context
                    .CategoryBooks.Where(cb => cb.CategoryId == Category.Id)
                    .Select(cb => cb.BookId)
                    .ToListAsync();

                var ToDeleteBookIds = CategoryBookIds
                    .Where(id => !body.KeptBookIds.Contains(id))
                    .ToList();

                foreach (var id in ToDeleteBookIds)
                {
                    var book =
                        await _context.Books.FirstOrDefaultAsync((b) => b.Id == id)
                        ?? throw new KeyNotFoundException("book not found");

                    book.CategoryId = null;
                }

                var booksToDelete = await _context
                    .CategoryBooks.Where(cb =>
                        ToDeleteBookIds.Contains(cb.BookId) && cb.CategoryId == Category.Id
                    )
                    .ToListAsync();

                _context.CategoryBooks.RemoveRange(booksToDelete);
            }

            // Handle addition of new books
            if (body.NewBookIds is not null && body.NewBookIds.Count > 0)
            {
                foreach (var id in body.NewBookIds)
                {
                    var exists = await _context.CategoryBooks.AnyAsync(cb =>
                        cb.BookId == id && cb.CategoryId == Category.Id
                    );

                    if (exists)
                        throw new BadHttpRequestException(
                            "Category with same book ID already exists."
                        );

                    var NewCategoryBook = new CategoryBook
                    {
                        Id = Guid.NewGuid().ToString(),
                        BookId = id,
                        CategoryId = Category.Id,
                    };

                    _context.CategoryBooks.Add(NewCategoryBook);
                }
            }

            await _context.SaveChangesAsync();

            return new Res<Category>(200, "Category updated successfully");
        }
        catch (Exception ex) when (ex is KeyNotFoundException || ex is BadHttpRequestException)
        {
            throw ex; // rethrow cleanly
        }
    }

    public async Task<Res<Category>> DeleteCategory(string Id)
    {
        try
        {
            var Category =
                await _context.Categories.FirstOrDefaultAsync((c) => c.Id == Id)
                ?? throw new KeyNotFoundException("Category not found");

            var CategoryBooks = await _context
                .CategoryBooks.Where((cb) => cb.CategoryId == Category.Id)
                .ToListAsync();

            foreach (var book in CategoryBooks)
            {
                var Book =
                    await _context.Books.FirstOrDefaultAsync((b) => b.Id == book.Id)
                    ?? throw new KeyNotFoundException("Book not found");

                Book.CategoryId = null;
            }
            _context.Categories.Remove(Category);
            _context.CategoryBooks.RemoveRange(CategoryBooks);

            await _context.SaveChangesAsync();

            return new Res<Category>(200, "Category updated successfully");
        }
        catch (Exception ex) when (ex is KeyNotFoundException || ex is BadHttpRequestException)
        {
            if (ex is BadHttpRequestException)
                throw new BadHttpRequestException(ex.Message);
            if (ex is KeyNotFoundException)
                throw new KeyNotFoundException(ex.Message);
            throw new Exception(ex.Message);
        }
    }

    public async Task<Res<GetCategoryDto>> GetCategoryById(string Id)
    {
        try
        {
            var Category =
                await _context
                    .Categories.Include(c => c.CategoryBooks)
                    .ThenInclude(cb => cb.Book)
                    .Select(category => new GetCategoryDto
                    {
                        Id = category.Id,
                        Name = category.Name,
                        Description = category.Description,
                        CreatedAt = category.CreatedAt,
                        Books = category
                            .CategoryBooks.Select(cb => new BookDto
                            {
                                Id = cb.Book.Id,
                                Title = cb.Book.Title,
                                BookPictureUrl = cb.Book.BookPictureUrl,
                                AvailableCopies = cb.Book.AvailableCopies,
                                Author = cb.Book.Author,
                            })
                            .ToList(),
                    })
                    .FirstOrDefaultAsync((c) => c.Id == Id)
                ?? throw new KeyNotFoundException("Category not found");

            return new Res<GetCategoryDto>(200, "Category updated successfully", Category);
        }
        catch (Exception ex) when (ex is KeyNotFoundException || ex is BadHttpRequestException)
        {
            if (ex is BadHttpRequestException)
                throw new BadHttpRequestException(ex.Message);
            if (ex is KeyNotFoundException)
                throw new KeyNotFoundException(ex.Message);
            throw new Exception(ex.Message);
        }
    }

    public async Task<Res<List<GetCategoryDto>>> GetAllCategories()
    {
        try
        {
            var categories = await _context
                .Categories.Include(c => c.CategoryBooks)
                .ThenInclude(cb => cb.Book)
                .ToListAsync();

            var categoryDtos = categories
                .Select(category => new GetCategoryDto
                {
                    Id = category.Id,
                    Name = category.Name,
                    Description = category.Description,
                    CreatedAt = category.CreatedAt,
                    Books = category
                        .CategoryBooks.Select(cb => new BookDto
                        {
                            Id = cb.Book.Id,
                            Title = cb.Book.Title,
                            BookPictureUrl = cb.Book.BookPictureUrl,
                            AvailableCopies = cb.Book.AvailableCopies,
                            Author = cb.Book.Author,
                        })
                        .ToList(),
                })
                .ToList();

            return new Res<List<GetCategoryDto>>(
                200,
                "Categories retrieved successfully",
                categoryDtos
            );
        }
        catch (Exception ex) when (ex is KeyNotFoundException || ex is BadHttpRequestException)
        {
            if (ex is BadHttpRequestException)
                throw new BadHttpRequestException(ex.Message);
            if (ex is KeyNotFoundException)
                throw new KeyNotFoundException(ex.Message);
            throw new Exception(ex.Message);
        }
    }
}
