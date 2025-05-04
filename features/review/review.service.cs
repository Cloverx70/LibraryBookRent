using backend.features.review.dtos;
using backend.Models;
using backend.utils;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;

namespace backend.features.review;

public interface IReviewService
{
    public Task<Res<Review>> CreateReview(CreateReviewDto body);
    public Task<Res<Review>> UpdateReview(string rid, UpdateReviewDto body);
    public Task<Res<Review>> DeleteReview(string rid);
    public Task<Res<List<Review>>> GetBookReviews(string bid);
}

public class ReviewService : IReviewService
{
    private readonly ApplicationDbContext _context;

    public ReviewService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Res<Review>> CreateReview(CreateReviewDto body)
    {
        try
        {
            var newReview = new Review()
            {
                Id = Guid.NewGuid().ToString(),
                UserId = body.UserId,
                BookId = body.BookId,
                Rating = body.Rating,
                ReviewText = body.ReviewText,
            };

            _context.Reviews.Add(newReview);

            await CalculateRating(body.BookId);

            await _context.SaveChangesAsync();

            return new Res<Review>(201, "Review Created Successfully");
        }
        catch (Exception ex) when (ex is KeyNotFoundException || ex is BadHttpRequestException)
        {
            throw ex;
        }
    }

    public async Task<Res<Review>> UpdateReview(string rid, UpdateReviewDto body)
    {
        try
        {
            if (rid.Length == 0)
                throw new BadHttpRequestException("rid is required");

            var Review = await _context.Reviews.FirstOrDefaultAsync((r) => r.Id == rid);

            if (Review is null)
                throw new KeyNotFoundException("Review was not found");

            UtilsMethods.PatchEntity(Review, body);

            await CalculateRating(Review.BookId);

            await _context.SaveChangesAsync();

            return new Res<Review>(200, "Review Updated Successfully");
        }
        catch (Exception ex) when (ex is KeyNotFoundException || ex is BadHttpRequestException)
        {
            throw ex;
        }
    }

    public async Task<Res<Review>> DeleteReview(string rid)
    {
        try
        {
            var Review = await _context.Reviews.FirstOrDefaultAsync((r) => r.Id == rid);

            if (Review is null)
                throw new KeyNotFoundException("Review Was Not Found");

            _context.Reviews.Remove(Review);

            await CalculateRating(Review.BookId);

            await _context.SaveChangesAsync();

            return new Res<Review>(200, "Review Created Successfully");
        }
        catch (Exception ex) when (ex is KeyNotFoundException || ex is BadHttpRequestException)
        {
            throw ex;
        }
    }

    public async Task<Res<List<Review>>> GetBookReviews(string bid)
    {
        try
        {
            var Reviews = await _context.Reviews.Where((r) => r.BookId == bid).ToListAsync();

            return new Res<List<Review>>(200, "Reviews returned successfully", Reviews);
        }
        catch (Exception ex) when (ex is KeyNotFoundException || ex is BadHttpRequestException)
        {
            throw ex;
        }
    }

    private async Task<Res<int>> CalculateRating(string bid)
    {
        try
        {
            var Book = await _context.Books.FirstOrDefaultAsync((b) => b.Id == bid);

            if (Book is null)
                throw new KeyNotFoundException("Book was not found");

            var BookReviews = await _context.Reviews.Where((r) => r.BookId == bid).ToListAsync();

            if (BookReviews.Count() != 0)
            {
                int ratingSum = 0;

                foreach (var review in BookReviews)
                {
                    ratingSum += review.Rating;
                }

                Book.Rating = ratingSum / BookReviews.Count();
            }
            else
                Book.Rating = 0;

            return new Res<int>(200, "Successfully Calculated Rating");
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }
}
