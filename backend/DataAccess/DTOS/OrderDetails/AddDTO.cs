using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace DataAccess.DTOS.OrderDetails
{
    public class AddDTO
    {
        [Required(ErrorMessage = "Product ID is required.")]
        [Range(1, int.MaxValue, ErrorMessage = "Invalid Product ID.")]
        public required int ProductID { get; set; }

        [Required(ErrorMessage = "Order ID is required.")]
        [Range(1, int.MaxValue, ErrorMessage = "Invalid Order ID.")]
        public required int OrderID { get; set; }


        [Required(ErrorMessage = "Quantity is required.")]
        [Range(0, int.MaxValue, ErrorMessage = "Invalid Amount.")]
        public required int Quantity { get; set; }

        [Required(ErrorMessage = "Price Name is required.")]

        [Range(0, double.MaxValue, ErrorMessage = "Invalid Price.")]
        public required decimal UnitPrice { get; set; }

        [Required(ErrorMessage = "Discount is required.")]

        [Range(0, 100, ErrorMessage = "Invalid Discount.")]
        public required decimal Discount { get; set; }
    }
}