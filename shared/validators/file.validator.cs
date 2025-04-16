using System;
using System.ComponentModel.DataAnnotations;
using System.IO;
using Microsoft.AspNetCore.Http;

public class FileValidationAttribute : ValidationAttribute
{
    private readonly string[] _allowedExtensions;
    private readonly long _maxFileSize;

    public FileValidationAttribute(string[] allowedExtensions, long maxFileSizeMB)
    {
        _allowedExtensions = allowedExtensions;
        _maxFileSize = maxFileSizeMB * 1024 * 1024; // Convert MB to bytes
    }

    protected override ValidationResult IsValid(object value, ValidationContext validationContext)
    {
        if (value is not IFormFile file)
        {
            return new ValidationResult(
                $"Invalid file type. Allowed: {string.Join(", ", _allowedExtensions)}"
            );
        }

        var extension = Path.GetExtension(file.FileName).ToLower();
        if (!_allowedExtensions.Contains(extension))
        {
            return new ValidationResult(
                $"Invalid file type. Allowed: {string.Join(", ", _allowedExtensions)}"
            );
        }

        if (file.Length > _maxFileSize)
        {
            return new ValidationResult(
                $"File size must be less than {_maxFileSize / (1024 * 1024)}MB."
            );
        }

        return ValidationResult.Success;
    }
}
