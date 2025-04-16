using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class Category
{
    public string Id { get; set; } = null!;

    public string Name { get; set; } = null!;

    public string? Description { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual ICollection<CategoryBook> CategoryBooks { get; set; } = new List<CategoryBook>();
}
