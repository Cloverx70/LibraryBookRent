using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class Book
{
    public string Id { get; set; } = null!;

    public string Title { get; set; } = null!;

    public string Author { get; set; } = null!;

    public string Isbn { get; set; } = null!;

    public string? CategoryId { get; set; }

    public int TotalCopies { get; set; }

    public int AvailableCopies { get; set; }

    public string? BorrowedBy { get; set; }

    public DateTime? BorrowedAt { get; set; }

    public DateTime? ReturnDueDate { get; set; }

    public DateTime? ReturnedAt { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public string? BookPictureUrl { get; set; }

    public string? Genre { get; set; }

    public string? Description { get; set; }

    public int Rating { get; set; }

    public virtual ICollection<CategoryBook> CategoryBooks { get; set; } = new List<CategoryBook>();

    public virtual ICollection<Review> Reviews { get; set; } = new List<Review>();

    public virtual ICollection<UserBookedBook> UserBookedBooks { get; set; } = new List<UserBookedBook>();
}
