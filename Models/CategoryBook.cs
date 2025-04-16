using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class CategoryBook
{
    public string Id { get; set; } = null!;

    public string CategoryId { get; set; } = null!;

    public string BookId { get; set; } = null!;

    public virtual Book Book { get; set; } = null!;

    public virtual Category Category { get; set; } = null!;
}
