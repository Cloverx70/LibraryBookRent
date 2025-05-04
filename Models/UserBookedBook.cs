using System;
using System.Collections.Generic;

namespace backend.Models;

public enum RentalStatus
{
    pending,
    approved,
    declined,
}

public partial class UserBookedBook
{
    public string Id { get; set; } = null!;

    public string UserId { get; set; } = null!;

    public string BookId { get; set; } = null!;

    public DateTime? BorrowedAt { get; set; }

    public DateTime? ReturnDueDate { get; set; }

    public DateTime? ReturnedAt { get; set; }

    public RentalStatus? Status { get; set; }

    public virtual Book Book { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
