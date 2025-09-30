using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace DataAccess.DTOS.Category
{
    public class AddDTO
    {
        [Required(ErrorMessage = "Title is required.")]
        [MinLength(4, ErrorMessage = "Title must be at least 4 characters long.")]
        [MaxLength(50, ErrorMessage = "Title must be less than 50 characters long.")]

        public required string Title { get; set; }

        [MaxLength(250, ErrorMessage = "Description must be less than 250 characters long.")]

        public required string Description { get; set; }

        [Url(ErrorMessage = "Invalid Picture URL")]
        [MaxLength(250, ErrorMessage = "URL must be less than 250 characters long.")]

        public string Image { get; set; } = string.Empty;
    }

}