using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DataAccess;
using DataAccess.DTOS;
using DataAccess.DTOS.Order;
using DataAccess.Filters;
using DataAccess.Repositories.Order;
using DataAccess.Services;
namespace BussinessAccess
{
    public class Order
    {
        public enum EnMode { Add = 1, Update = 2 }
        public EnMode Mode = EnMode.Add;
        public int OrderID { get; set; }
        public int UserID { get; set; }
        public string UserName { get; set; }
        public DateTime OrderDate { get; set; }
        public decimal TotalAmount { get; set; }
        public byte OrderStatus { get; set; }
        public decimal Discount { get; set; }
        public string PaymentMethod { get; set; }
        public Order(OrderDTO order, EnMode mode)
        {
            Mode = mode;
            this.OrderID = order.OrderID;
            this.UserID = order.UserID;
            this.TotalAmount = order.TotalAmount;
            this.OrderStatus = order.OrderStatus;
            this.Discount = order.Discount;
            this.OrderDate = order.OrderDate;
            this.PaymentMethod = order.PaymentMethod;
            this.UserName = order.UserName;
        }


        public Order(AddDTO order, EnMode mode)
        {
            Mode = mode;
            this.OrderID = -1;
            this.UserName = string.Empty;
            this.UserID = order.UserID;
            this.OrderStatus = order.OrderStatus;
            this.Discount = order.Discount;
            this.OrderDate = DateTime.UtcNow;
            this.PaymentMethod = order.PaymentMethod;
        }
        public OrderDTO OrderDTO
        {
            get
            {
                return new OrderDTO(OrderID, UserID, UserName, OrderDate, TotalAmount, OrderStatus, Discount, PaymentMethod);
            }
        }
        public AddDTO AddOrderDTO
        {
            get
            {
                return new AddDTO
                {
                    UserID = UserID,
                    OrderStatus = OrderStatus,
                    Discount = Discount,
                    PaymentMethod = PaymentMethod
                };
            }
        }


        public static async Task<Order> FindOrderByID(int OrderID)
        {
            if (OrderID <= 0)
            {
                throw new InvalidOperationException("OrderID not valid");
            }
            OrderDTO OrderDTO = await OrderRepository.GetOrderByID(OrderID);
            if (OrderDTO.OrderID == -1)
            {
                throw new InvalidOperationException("Order not found");
            }
            else
                return new Order(OrderDTO, EnMode.Update);
        }

        private async Task<bool> _AddOrderAsync()
        {
            // should add condition to check user ID if valid if exist in database
            this.OrderID = await OrderRepository.AddOrderAsync(AddOrderDTO);
            if (this.OrderID == -1)
            {
                throw new InvalidOperationException("Error adding Order ");
            }
            return this.OrderID != -1;

        }
        private async Task<bool> _UpdateOrder()
        {
            return await OrderRepository.UpdateOrderAsync(AddOrderDTO, OrderID);
        }
        public async Task<bool> SaveAsync()
        {
            switch (Mode)
            {
                case EnMode.Add:
                    if (await _AddOrderAsync())
                    {
                        Mode = EnMode.Update;
                        return true;
                    }
                    return false;
                case EnMode.Update:
                    return await _UpdateOrder();
                default:
                    return false;
            }
        }
        public static async Task<bool> IsOrderExistByOrderID(int OrderID)
        {
            if (OrderID < 1)
            {
                throw new InvalidOperationException("OrderID not Valid");
            }
            return await OrderRepository.IsOrderIDExistedAsync(OrderID);
        }

        public static async Task<bool> DeleteOrder(int OrderID)
        {
            if (OrderID < 1)
            {
                throw new InvalidOperationException("Order ID not Valid");
            }
            return await OrderRepository.DeleteOrderAsync(OrderID);
        }
        public static async Task<IEnumerable<OrderDTO>> GetOrders(int pageNumber, int LimitOfOrders)
        {
            if (pageNumber < 0)
            {
                pageNumber = 1;
            }
            if (LimitOfOrders < 0)
            {
                pageNumber = 1;
            }
            return await OrderRepository.GetAllOrdersAsync(new DataAccess.Services.PageFilter(pageNumber, LimitOfOrders));
        }



        private static DataAccess.Filters.FilterType.Order getProductFilterType(string FilterType)
        {
            switch (FilterType.ToLower())
            {
                case "orderdate": return DataAccess.Filters.FilterType.Order.OrderDate;
                case "orderstatus": return DataAccess.Filters.FilterType.Order.OrderStatus;
                case "username": return DataAccess.Filters.FilterType.Order.UserName;
                default: return DataAccess.Filters.FilterType.Order.UserName;
            }
        }
        public static async Task<IEnumerable<OrderDTO>> FilterAsync(string filterType, string value, int pageNumber, int LimitOfOrders)
        {
            if (pageNumber < 0)
            {
                pageNumber = 1;
            }
            if (LimitOfOrders < 0)
            {
                pageNumber = 1;
            }
            if (string.IsNullOrEmpty(value))
            {
                throw new InvalidOperationException($"Text Search not Valid");
            }
            if (string.IsNullOrEmpty(filterType))
            {
                throw new InvalidOperationException($"{filterType} not Valid");
            }
            return await OrderRepository.GetOrdersByFilterAsync(getProductFilterType(filterType), new ValueFilter { value = value, page = new PageFilter(pageNumber, LimitOfOrders) });
        }




    }
}