using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DataAccess.DTOS.Order
{
    public class OrderDTO
    {
        public int OrderID { get; set; }
        public int UserID { get; set; }
        public string UserName { get; set; }
        public DateTime OrderDate { get; set; }
        public decimal TotalAmount { get; set; }
        public byte OrderStatus { get; set; }
        public decimal Discount { get; set; }
        public string PaymentMethod { get; set; }
        public OrderDTO(int OrderID, int UserID, string UserName, DateTime OrderDate, decimal TotalAmount,
        byte OrderStatus, decimal Discount, string PaymentMethod)
        {
            this.OrderID = OrderID;
            this.UserID = UserID;
            this.UserName = UserName;
            this.TotalAmount = TotalAmount;
            this.OrderStatus = OrderStatus;
            this.Discount = Discount;
            this.OrderDate = OrderDate;
            this.PaymentMethod = PaymentMethod;
        }
        public OrderDTO()
        {
            this.OrderID = this.UserID = -1;
            this.TotalAmount = 0;
            this.UserName = string.Empty;
            this.OrderStatus = 0; this.PaymentMethod = string.Empty;
            this.Discount = 0;

        }
    }

}