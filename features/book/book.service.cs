using System.Text.RegularExpressions;
using backend.features.book.dtos;
using backend.Models;
using backend.utils;
using backend.utils.s3bucket;
using Microsoft.EntityFrameworkCore;

namespace backend.features.book;

public interface IBookService
{
    public Task<Res<Book>> CreateBook(createBookDto body);
    public Task<Res<Book>> UpdateBookById(string id, UpdateBookDto body);
    public Task<Res<Book>> DeleteBookById(string id);
    public Task<Res<Book>> GetBookById(string id);
    public Task<Res<List<Book>>> GetAllBooksBySearchSortAndFilter(
        FilterBooksDto filter,
        string query,
        string sort
    );
}

public class BookService : IBookService
{
    public readonly ApplicationDbContext _context;

    public readonly IConfiguration _configration;

    public readonly IS3Service _S3Service;

    public BookService(
        ApplicationDbContext context,
        IConfiguration configuration,
        IS3Service s3Service
    )
    {
        _context = context;
        _configration = configuration;
        _S3Service = s3Service;
    }

    public async Task<Res<Book>> CreateBook(createBookDto body)
    {
        try
        {
            var nameExists = await _context.Books.FirstOrDefaultAsync((b) => b.Title == body.Title);

            if (nameExists is not null)
                throw new BadHttpRequestException("a book with the same title already exists.");

            var isbnExists = await _context.Books.FirstOrDefaultAsync((b) => b.Isbn == body.Isbn);

            if (isbnExists is not null)
                throw new BadHttpRequestException("a book with the Isbn title already exists.");

            string? url = null;

            if (body.File != null)
            {
                string filePath = "books/";

                using (var stream = body.File.OpenReadStream())
                {
                    Res<string> uploadRes = await _S3Service.UploadFileAsync(
                        filePath,
                        stream,
                        body.File.FileName
                    );

                    if (uploadRes.Code != 200)
                        throw new BadHttpRequestException(uploadRes.Message);

                    url = uploadRes.Data;
                }
            }

            Book newBook = new Book
            {
                Id = Guid.NewGuid().ToString(),
                Title = body.Title,
                Author = body.Author,
                Isbn = body.Isbn,
                Description = body.Description,
                BookPictureUrl = !string.IsNullOrEmpty(url) && url.Length > 0 ? url : null,
                CategoryId = body.CategoryId,
                TotalCopies = body.TotalCopies,
                AvailableCopies = body.AvailableCopies,
            };

            _context.Books.Add(newBook);
            await _context.SaveChangesAsync();

            return new Res<Book>(201, "book created successfully");
        }
        catch (Exception ex) when (ex is BadHttpRequestException)
        {
            if (ex is BadHttpRequestException)
                throw new BadHttpRequestException(ex.Message);
            throw new Exception(ex.Message);
        }
    }

    public async Task<Res<Book>> UpdateBookById(string id, UpdateBookDto body)
    {
        try
        {
            var book =
                await _context.Books.FindAsync(id)
                ?? throw new KeyNotFoundException("book not found");

            string? url = book.BookPictureUrl;

            if (body.File != null)
            {
                string filePath = "books/";

                if (!string.IsNullOrEmpty(url))
                {
                    var deleteFromBucketRes = await _S3Service.DeleteFileAsyncByURL(url);

                    if (deleteFromBucketRes.Code != 200)
                        throw new BadHttpRequestException(deleteFromBucketRes.Message);

                    url = null;
                }

                using (var stream = body.File.OpenReadStream())
                {
                    Res<string> uploadRes = await _S3Service.UploadFileAsync(
                        filePath,
                        stream,
                        body.File.FileName
                    );

                    if (uploadRes.Code != 200)
                        throw new BadHttpRequestException(uploadRes.Message);

                    url = uploadRes.Data;
                    body.File = null;
                }
            }

            UtilsMethods.PatchEntity(book, body);

            book.BookPictureUrl = url;

            await _context.SaveChangesAsync();

            return new Res<Book>(200, "book updated successfully");
        }
        catch (Exception ex) when (ex is BadHttpRequestException || ex is KeyNotFoundException)
        {
            if (ex is BadHttpRequestException)
                throw new BadHttpRequestException(ex.Message);
            if (ex is KeyNotFoundException)
                throw new KeyNotFoundException(ex.Message);
            throw new Exception(ex.Message);
        }
    }

    public async Task<Res<Book>> DeleteBookById(string id)
    {
        try
        {
            var book =
                await _context.Books.FindAsync(id)
                ?? throw new KeyNotFoundException("book not found");

            if (!string.IsNullOrEmpty(book.BookPictureUrl))
            {
                var deleteFromBucketRes = await _S3Service.DeleteFileAsyncByURL(
                    book.BookPictureUrl
                );

                if (deleteFromBucketRes.Code != 200)
                    throw new BadHttpRequestException(deleteFromBucketRes.Message);
            }

            _context.Books.Remove(book);
            await _context.SaveChangesAsync();

            return new Res<Book>(200, "book deleted successfully");
        }
        catch (Exception ex)
        {
            if (ex is BadHttpRequestException)
                throw new BadHttpRequestException(ex.Message);
            if (ex is KeyNotFoundException)
                throw new KeyNotFoundException(ex.Message);
            throw new Exception(ex.Message);
        }
    }

    public async Task<Res<Book>> GetBookById(string id)
    {
        try
        {
            var book =
                await _context.Books.FindAsync(id)
                ?? throw new KeyNotFoundException("book not found");

            return new Res<Book>(200, "successfully returned book", book);
        }
        catch (Exception ex)
        {
            if (ex is KeyNotFoundException)
                throw new KeyNotFoundException(ex.Message);
            throw new Exception(ex.Message);
        }
    }

    public async Task<Res<List<Book>>> GetAllBooksBySearchSortAndFilter(
        FilterBooksDto filter,
        string sort,
        string? query
    )
    {
        try
        {
            var booksQuery = _context.Books.AsQueryable();
            if (filter.IsAvailable.HasValue)
            {
                if (filter.IsAvailable.Value)
                    booksQuery = booksQuery.Where(b =>
                        b.AvailableCopies > 0 && string.IsNullOrEmpty(b.BorrowedBy)
                    );
                else
                    booksQuery = booksQuery.Where(b =>
                        b.AvailableCopies == 0 || !string.IsNullOrEmpty(b.BorrowedBy)
                    );
            }

            if (!string.IsNullOrEmpty(filter.CategoryId))
                booksQuery = booksQuery.Where(b => b.CategoryId == filter.CategoryId);

            if (!string.IsNullOrEmpty(filter.Genre))
            {
                booksQuery = booksQuery.Where(b => b.Genre == filter.Genre);
            }

            switch (sort)
            {
                case "alpha-asc":
                    booksQuery = booksQuery.OrderBy(b => b.Title);
                    break;

                case "alpha-desc":
                    booksQuery = booksQuery.OrderByDescending(b => b.Title);
                    break;

                case "date-asc":
                    booksQuery = booksQuery.OrderBy(b => b.CreatedAt);
                    break;

                case "date-desc":
                    booksQuery = booksQuery.OrderByDescending(b => b.CreatedAt);
                    break;

                default:
                    booksQuery = booksQuery.OrderByDescending(b => b.CreatedAt);
                    break;
            }

            var books = await booksQuery.ToListAsync();

            if (!string.IsNullOrEmpty(query))
            {
                var regexValue = new Regex(query, RegexOptions.IgnoreCase);
                books = books.Where(b => regexValue.IsMatch(b.Title)).ToList();
            }

            return new Res<List<Book>>(200, "Successfully returned books", books);
        }
        catch (Exception ex)
        {
            if (ex is BadHttpRequestException)
                throw new BadHttpRequestException(ex.Message);
            if (ex is KeyNotFoundException)
                throw new KeyNotFoundException(ex.Message);
            throw new Exception(ex.Message);
        }
    }
}
