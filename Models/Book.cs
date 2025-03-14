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

    public virtual User? BorrowedByNavigation { get; set; }

    public virtual Category? Category { get; set; }

    public virtual ICollection<Review> Reviews { get; set; } = new List<Review>();
}
