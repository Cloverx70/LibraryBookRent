using System.Text.RegularExpressions;
using backend.features.auth.dtos;
using backend.features.booking.dtos;
using backend.Models;
using backend.utils.email;
using Microsoft.EntityFrameworkCore;

namespace backend.features.booking;

public interface IBookingService
{
    public Task<Res<string>> BookABook(BookABookDto body);

    public Task<Res<string>> ApproveRental(string rid);

    public Task<Res<string>> DeclineRental(string rid);

    public Task<Res<string>> ReturnABook(string rid);

    public Task<Res<List<RentalDto>>> GetAllRentals(string? query);
    public Task<Res<RentalDto>> GetRentalById(string id);
}

public class BookingService : IBookingService
{
    private readonly ApplicationDbContext _context;

    private readonly IemailService _emailService;

    public BookingService(ApplicationDbContext context, IemailService emailService)
    {
        _emailService = emailService;
        _context = context;
    }

    public async Task<Res<string>> BookABook(BookABookDto body)
    {
        try
        {
            var activeBookingsByUser = await _context
                .UserBookedBooks.Where((ub) => ub.UserId == body.UserId && ub.ReturnedAt == null)
                .ToListAsync();

            if (activeBookingsByUser.Count() > 4)
                throw new BadHttpRequestException("User exceeded the maximum borrowing limit");

            var BookDuplicate = activeBookingsByUser.Where((ub) => ub.BookId == body.BookId);

            if (BookDuplicate.Count() > 0)
                throw new BadHttpRequestException("you cant book the same book twice");

            var Book =
                await _context.Books.FirstOrDefaultAsync((b) => b.Id == body.BookId)
                ?? throw new KeyNotFoundException("book not found");

            if (Book.AvailableCopies <= 0)
                throw new BadHttpRequestException("this book is out of stock");

            var newBooking = new UserBookedBook()
            {
                Id = Guid.NewGuid().ToString(),
                BookId = body.BookId,
                UserId = body.UserId,
                Status = RentalStatus.pending,
            };

            Book.AvailableCopies--;

            _context.UserBookedBooks.Add(newBooking);

            await _context.SaveChangesAsync();

            return new Res<string>(201, "Booked a book successfully");
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }

    public async Task<Res<string>> ApproveRental(string rid)
    {
        try
        {
            // Load the actual EF entity so changes are tracked
            var rentalEntity = await _context
                .UserBookedBooks.Include(r => r.User)
                .Include(r => r.Book)
                .FirstOrDefaultAsync(r => r.Id == rid);

            if (rentalEntity == null)
                return new Res<string>(404, "Rental not found");

            var emailHtml =
                $@"
<html>
  <body style='font-family: Arial, sans-serif; color: #333; background-color: #f9f9f9; padding: 20px;'>
    <div style='max-width: 600px; margin: auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);'>
      <h2 style='color: #2c3e50;'>📚 Rental Approved: #{rentalEntity.Id}</h2>
      <p>Dear <strong>{rentalEntity.User.FirstName}</strong>,</p>

      <p>Your book rental request has been <strong>approved</strong>!</p>

      <p>
        Please visit the <strong>library at Block E, 10th floor</strong> on <strong>Mondays only</strong> to collect your book.
        Make sure to collect it on time, as delays may lead to cancellation.
      </p>

      <h3 style='margin-top: 25px; color: #34495e;'>📌 Important Rental Rules:</h3>
      <ul style='padding-left: 20px;'>
        <li>Collect the book promptly after approval — delays may result in cancellation.</li>
        <li>Return the book by the due date to avoid penalties.</li>
        <li>The book must be returned in the same condition it was issued.</li>
        <li>You are fully responsible for any damage or changes in the book’s condition.</li>
        <li>You have <strong>7 days from the date of collection</strong> to return the book.</li>
      </ul>

      <p style='margin-top: 25px;'>Thank you for following the guidelines and helping us maintain a smooth rental system.</p>

      <p style='margin-top: 30px;'>Best regards,<br><strong>LIU Administration</strong></p>
    </div>
  </body>
</html>
";

            rentalEntity.Status = RentalStatus.approved;
            rentalEntity.BorrowedAt = DateTime.Now;
            rentalEntity.ReturnDueDate = DateTime.Now.AddDays(7);

            _emailService.sendEmail(
                rentalEntity.User.Email,
                $"Rental Approved #{rentalEntity.Id}",
                emailHtml,
                true
            );

            await _context.SaveChangesAsync();

            return new Res<string>(200, "Rental approved successfully");
        }
        catch (Exception ex)
        {
            throw;
        }
    }

    public async Task<Res<string>> DeclineRental(string rid)
    {
        try
        {
            var rental = await _context
                .UserBookedBooks.Include(r => r.User)
                .Include(r => r.Book)
                .FirstOrDefaultAsync(r => r.Id == rid);

            if (rental == null)
                return new Res<string>(404, "Rental not found");

            if (rental.Status == RentalStatus.approved)
                throw new BadHttpRequestException(
                    "The order cannot be changed from approved to declined"
                );

            rental.Status = RentalStatus.declined;

            var emailHtml =
                $@"
<html>
  <body style='font-family: Arial, sans-serif; color: #333; background-color: #f9f9f9; padding: 20px;'>
    <div style='max-width: 600px; margin: auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);'>
      <h2 style='color: #c0392b;'>❌ Rental Declined: #{rental.Id}</h2>
      <p>Dear <strong>{rental.User.FirstName}</strong>,</p>
      <p>We regret to inform you that your book rental request has been <strong>declined</strong>.</p>
      <p>Please make sure all your submitted data is accurate and your account complies with the rental policy.</p>
      <p>You may try booking again later if needed.</p>
      <p style='margin-top: 30px;'>Best regards,<br><strong>LIU Administration</strong></p>
    </div>
  </body>
</html>
";

            _emailService.sendEmail(
                rental.User.Email,
                $"Rental Declined #{rental.Id}",
                emailHtml,
                true
            );

            await _context.SaveChangesAsync();
            return new Res<string>(200, "Rental declined successfully");
        }
        catch (Exception)
        {
            throw;
        }
    }

    public async Task<Res<string>> ReturnABook(string rid)
    {
        try
        {
            var rental = await _context
                .UserBookedBooks.Include(r => r.User)
                .Include(r => r.Book)
                .FirstOrDefaultAsync(r => r.Id == rid);

            if (rental == null)
                return new Res<string>(404, "Booking was not found");

            rental.ReturnedAt = DateTime.Now;
            rental.ReturnDueDate = null;
            rental.Status = RentalStatus.returned;

            var emailHtml =
                $@"
<html>
  <body style='font-family: Arial, sans-serif; color: #333; background-color: #f9f9f9; padding: 20px;'>
    <div style='max-width: 600px; margin: auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);'>
      <h2 style='color: #27ae60;'>✅ Book Returned: #{rental.Id}</h2>
      <p>Dear <strong>{rental.User.FirstName}</strong>,</p>
      <p>We have successfully received your returned book.</p>
      <p>Thank you for using our library system and returning the book on time.</p>
      <p>We hope you had a pleasant reading experience!</p>
      <p style='margin-top: 30px;'>Best regards,<br><strong>LIU Administration</strong></p>
    </div>
  </body>
</html>
";

            _emailService.sendEmail(
                rental.User.Email,
                $"Book Returned #{rental.Id}",
                emailHtml,
                true
            );

            await _context.SaveChangesAsync();
            return new Res<string>(200, "Book returned successfully");
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }

    public async Task<Res<List<RentalDto>>> GetAllRentals(string? query)
    {
        try
        {
            var rentalsQuery = _context.UserBookedBooks.Include(r => r.Book).Include(r => r.User);

            var rentalsList = await rentalsQuery.ToListAsync();

            if (!string.IsNullOrEmpty(query))
            {
                var regex = new Regex(query, RegexOptions.IgnoreCase);
                rentalsList = rentalsList
                    .Where(r => regex.IsMatch(r.User.Username) || regex.IsMatch(r.Book.Title))
                    .ToList();
            }

            var rentals = rentalsList
                .Select(r => new RentalDto
                {
                    Id = r.Id,
                    User = new GetUserDto
                    {
                        Id = r.User.Id,
                        FirstName = r.User.FirstName,
                        LastName = r.User.LastName,
                        Email = r.User.Email,
                        PhoneNumber = r.User.PhoneNumber,
                        Address = r.User.Address,
                        Username = r.User.Username,
                        StudentMajor = r.User.StudentMajor,
                        Role = r.User.Role,
                        CreatedAt = r.User.CreatedAt,
                        UpdatedAt = r.User.UpdatedAt,
                    },
                    Book = new Book
                    {
                        Id = r.Book.Id,
                        Title = r.Book.Title,
                        Author = r.Book.Author,
                        Isbn = r.Book.Isbn,
                        CategoryId = r.Book.CategoryId,
                        TotalCopies = r.Book.TotalCopies,
                        AvailableCopies = r.Book.AvailableCopies,
                        BorrowedBy = r.Book.BorrowedBy,
                        BorrowedAt = r.Book.BorrowedAt,
                        ReturnDueDate = r.Book.ReturnDueDate,
                        ReturnedAt = r.Book.ReturnedAt,
                        CreatedAt = r.Book.CreatedAt,
                        UpdatedAt = r.Book.UpdatedAt,
                        BookPictureUrl = r.Book.BookPictureUrl,
                        Genre = r.Book.Genre,
                        Description = r.Book.Description,
                    },
                    BorrowedAt = r.BorrowedAt,
                    ReturnDueDate = r.ReturnDueDate,
                    ReturnedAt = r.ReturnedAt,
                    Status = r.Status,
                })
                .ToList();

            return new Res<List<RentalDto>>(200, "Retrieved rentals successfully", rentals);
        }
        catch (Exception ex)
        {
            throw new Exception("Failed to retrieve rentals: " + ex.Message);
        }
    }

    public async Task<Res<RentalDto>> GetRentalById(string id)
    {
        try
        {
            var rental = await _context
                .UserBookedBooks.Where((ubb) => ubb.Id == id)
                .Select(r => new RentalDto
                {
                    Id = r.Id,
                    User = new GetUserDto
                    {
                        Id = r.User.Id,
                        FirstName = r.User.FirstName,
                        LastName = r.User.LastName,
                        Email = r.User.Email,
                        PhoneNumber = r.User.PhoneNumber,
                        Address = r.User.Address,
                        Username = r.User.Username,
                        StudentMajor = r.User.StudentMajor,
                        Role = r.User.Role,
                        CreatedAt = r.User.CreatedAt,
                        UpdatedAt = r.User.UpdatedAt,
                    },
                    Book = new Book
                    {
                        Id = r.Book.Id,
                        Title = r.Book.Title,
                        Author = r.Book.Author,
                        Isbn = r.Book.Isbn,
                        CategoryId = r.Book.CategoryId,
                        TotalCopies = r.Book.TotalCopies,
                        AvailableCopies = r.Book.AvailableCopies,
                        BorrowedBy = r.Book.BorrowedBy,
                        BorrowedAt = r.Book.BorrowedAt,
                        ReturnDueDate = r.Book.ReturnDueDate,
                        ReturnedAt = r.Book.ReturnedAt,
                        CreatedAt = r.Book.CreatedAt,
                        UpdatedAt = r.Book.UpdatedAt,
                        BookPictureUrl = r.Book.BookPictureUrl,
                        Genre = r.Book.Genre,
                        Description = r.Book.Description,
                    },
                    BorrowedAt = r.BorrowedAt,
                    ReturnDueDate = r.ReturnDueDate,
                    ReturnedAt = r.ReturnedAt,
                    Status = r.Status,
                })
                .FirstOrDefaultAsync();

            return new Res<RentalDto>(200, "Retrieved rentals successfully", rental);
        }
        catch (Exception ex)
        {
            throw new Exception("Failed to retrieve rentals: " + ex.Message);
        }
    }
}
