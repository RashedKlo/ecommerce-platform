using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace DataAccess.DTOS.Order
{
    public class AddDTO
    {
        [Required(ErrorMessage = "User ID is required.")]
        [Range(1, int.MaxValue, ErrorMessage = "Invalid User ID.")]
        public required int UserID { get; set; }


        [Required(ErrorMessage = "Order Status is required.")]
        [MinLength(4, ErrorMessage = "Order Status must be at least 4 characters long.")]
        [MaxLength(50, ErrorMessage = "Order Status must be less than 50 characters long.")]

        public required byte OrderStatus { get; set; }


        [Required(ErrorMessage = "Discount is required.")]

        [Range(0, 100, ErrorMessage = "Invalid Discount.")]
        public required decimal Discount { get; set; }

        [Required(ErrorMessage = "Payment Method is required.")]
        [MinLength(4, ErrorMessage = "Payment Method must be at least 4 characters long.")]
        [MaxLength(50, ErrorMessage = "Payment Method must be less than 50 characters long.")]

        public required string PaymentMethod { get; set; }
    }

}