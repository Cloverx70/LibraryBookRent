using backend.features.booking.dtos;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.features.booking;

public interface IBookingService
{
    public Task<Res<string>> BookABook(BookABookDto body);

    public Task<Res<string>> ApproveRental(BookABookDto body);

    public Task<Res<string>> DeclineRental(BookABookDto body);

    public Task<Res<string>> ReturnABook(ReturnABookDto body);
}

public class BookingService : IBookingService
{
    private readonly ApplicationDbContext _context;

    public BookingService(ApplicationDbContext context)
    {
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

    public async Task<Res<string>> ApproveRental(BookABookDto body)
    {
        try
        {
            var Rental =
                await _context.UserBookedBooks.FirstOrDefaultAsync(
                    (r) => r.UserId == body.UserId && r.BookId == body.BookId
                ) ?? throw new KeyNotFoundException("Rental was not found");

            Rental.Status = RentalStatus.approved;
            Rental.BorrowedAt = DateTime.Now;
            Rental.ReturnDueDate = DateTime.Now.AddDays(7);

            await _context.SaveChangesAsync();

            return new Res<string>(200, "Rental approved successfully");
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }

    public async Task<Res<string>> DeclineRental(BookABookDto body)
    {
        try
        {
            var Rental =
                await _context.UserBookedBooks.FirstOrDefaultAsync(
                    (r) => r.UserId == body.UserId && r.BookId == body.BookId
                ) ?? throw new KeyNotFoundException("Rental was not found");

            if (Rental.Status == RentalStatus.approved)
                throw new BadHttpRequestException(
                    "the order cannot be changed from approved to declined"
                );

            Rental.Status = RentalStatus.declined;
            await _context.SaveChangesAsync();

            return new Res<string>(200, "Rental approved successfully");
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }

    public async Task<Res<string>> ReturnABook(ReturnABookDto body)
    {
        try
        {
            var Booking =
                await _context.UserBookedBooks.FirstOrDefaultAsync(
                    (b) => b.BookId == body.BookId && b.UserId == body.UserId
                ) ?? throw new KeyNotFoundException("Booking was not found");

            Booking.ReturnedAt = DateTime.Now;

            await _context.SaveChangesAsync();

            return new Res<string>(200, "returned book successfully");
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }
}
