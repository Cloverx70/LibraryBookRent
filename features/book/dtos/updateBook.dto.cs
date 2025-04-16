using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace backend.features.book.dtos
{
    public class UpdateBookDto : IValidatableObject
    {
        public string? Title { get; set; }

        public string? Author { get; set; }

        public string? Isbn { get; set; }

        public string? Description { get; set; }

        public string? CategoryId { get; set; }

        // The File field is optional during update
        public IFormFile? File { get; set; }

        public int? TotalCopies { get; set; }

        public int? AvailableCopies { get; set; }

        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            // Title Validation
            if (Title is not null && string.IsNullOrWhiteSpace(Title))
                yield return new ValidationResult(
                    "Title cannot be empty.",
                    new[] { nameof(Title) }
                );

            // Description Validation
            if (Description is not null && string.IsNullOrWhiteSpace(Description))
                yield return new ValidationResult(
                    "Title cannot be empty.",
                    new[] { nameof(Description) }
                );

            // Author Validation
            if (Author is not null && string.IsNullOrWhiteSpace(Author))
                yield return new ValidationResult(
                    "Author cannot be empty.",
                    new[] { nameof(Author) }
                );

            // ISBN Validation
            if (Isbn is not null && string.IsNullOrWhiteSpace(Isbn))
                yield return new ValidationResult("ISBN cannot be empty.", new[] { nameof(Isbn) });

            // TotalCopies Validation
            if (TotalCopies is not null && TotalCopies < 0)
                yield return new ValidationResult(
                    "TotalCopies must be a non-negative number.",
                    new[] { nameof(TotalCopies) }
                );

            // AvailableCopies Validation
            if (AvailableCopies is not null && AvailableCopies < 0)
                yield return new ValidationResult(
                    "AvailableCopies must be a non-negative number.",
                    new[] { nameof(AvailableCopies) }
                );

            // AvailableCopies cannot be greater than TotalCopies
            if (
                AvailableCopies is not null
                && TotalCopies is not null
                && AvailableCopies > TotalCopies
            )
                yield return new ValidationResult(
                    "AvailableCopies cannot be greater than TotalCopies.",
                    new[] { nameof(AvailableCopies) }
                );

            // File Validation: This will be invoked only when File is not null
            if (File != null)
            {
                // Apply file validation here explicitly if needed
                var fileValidationResult = ValidateFile(File);
                if (fileValidationResult != ValidationResult.Success)
                    yield return fileValidationResult;
            }
        }

        // Custom file validation function
        private ValidationResult ValidateFile(IFormFile file)
        {
            // Add your file validation logic here (like extensions, file size)
            var allowedExtensions = new[] { ".jpeg", ".jpg", ".png" };
            var maxFileSize = 5 * 1024 * 1024; // 5MB

            var extension = Path.GetExtension(file.FileName).ToLower();
            if (!Array.Exists(allowedExtensions, ext => ext.Equals(extension)))
            {
                return new ValidationResult(
                    $"Invalid file type. Allowed: {string.Join(", ", allowedExtensions)}",
                    new[] { nameof(File) }
                );
            }

            if (file.Length > maxFileSize)
            {
                return new ValidationResult(
                    $"File size must be less than {maxFileSize / (1024 * 1024)}MB.",
                    new[] { nameof(File) }
                );
            }

            return ValidationResult.Success;
        }
    }
}
