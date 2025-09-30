using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DataAccess.DTOS.OrderDetails
{
    public class OrderDetailDTO
    {
        public int OrderDetailID { get; set; }
        public int OrderID { get; set; }
        public int ProductID { get; set; }
        public string ProductName { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal Discount { get; set; }

        // public totalPrice

        public OrderDetailDTO(int OrderDetailID, int ProductID, string ProductName, int OrderID, int Quantity, decimal UnitPrice, decimal Discount)
        {
            this.OrderDetailID = OrderDetailID;
            this.ProductID = ProductID;
            this.UnitPrice = UnitPrice;
            this.Discount = Discount;
            this.Quantity = Quantity;
            this.OrderID = OrderID;
            this.ProductName = ProductName;
        }
        public OrderDetailDTO()
        {
            this.OrderDetailID = this.ProductID = this.OrderID = -1;
            this.UnitPrice = this.Discount = 0;
            this.ProductName = string.Empty;
        }

    }

}