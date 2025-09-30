using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using DataAccess.DTOS.Product.Image;

namespace DataAccess.DTOS.Product
{
    public class AddDTO
    {

        [Required(ErrorMessage = "Category ID is required.")]
        [Range(1, int.MaxValue, ErrorMessage = "Invalid Category ID.")]
        public required int CategoryID { get; set; }


        [Required(ErrorMessage = "Product Name is required.")]
        [MinLength(4, ErrorMessage = "ProductName must be at least 4 characters long.")]
        [MaxLength(50, ErrorMessage = "ProductName must be less than 50 characters long.")]

        public required string ProductName { get; set; }


        [MaxLength(250, ErrorMessage = "Description must be less than 250 characters long.")]
        public string Description { get; set; } = string.Empty;


        [Required(ErrorMessage = "Price Name is required.")]

        [Range(0, double.MaxValue, ErrorMessage = "Invalid Price.")]
        public required decimal Price { get; set; }


        [Required(ErrorMessage = "Discount is required.")]

        [Range(0, 100, ErrorMessage = "Invalid Discount.")]
        public required decimal Discount { get; set; }

        [Required(ErrorMessage = "Rating is required.")]

        [Range(0, 5, ErrorMessage = "Invalid Rating.")]
        public required double Rating { get; set; }

        [Required(ErrorMessage = "Quantity is required.")]
        [Range(0, int.MaxValue, ErrorMessage = "Invalid Amount.")]
        public required int QuantityInStock { get; set; }


        public List<ImageDTO> ImagesDTO { get; set; } = [];
    }

}