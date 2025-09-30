using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace DataAccess.DTOS.User
{
    public class RegisterDTO
    {
        [Required(ErrorMessage = "Username is required.")]
        [MinLength(4, ErrorMessage = "Username must be at least 4 characters long.")]
        [MaxLength(50, ErrorMessage = "UserName must be less than 50 characters long.")]

        public required string UserName { get; set; }

        [Required(ErrorMessage = "Role is required.")]
        [MaxLength(20, ErrorMessage = "Role must be less than 20 characters long.")]

        public required string Role { get; set; }

        [Required(ErrorMessage = "Email is required.")]
        [EmailAddress(ErrorMessage = "Invalid email address format.")]
        [MaxLength(50, ErrorMessage = "Email must be less than 50 characters long.")]

        public required string Email { get; set; }

        [Required(ErrorMessage = "Country ID is required.")]
        [Range(1, int.MaxValue, ErrorMessage = "Invalid Country ID.")]
        public required int CountryID { get; set; }

        [Required(ErrorMessage = "Birth date is required.")]
        [DataType(DataType.Date, ErrorMessage = "Invalid date format.")]
        public required DateTime BirthDate { get; set; }
        [Url(ErrorMessage = "Invalid Picture URL")]

        public string ProfilePicture { get; set; } = string.Empty;

        [MinLength(6, ErrorMessage = "Password must be at least 6 characters long.")]
        public string Password { get; set; } = string.Empty;
    }
}