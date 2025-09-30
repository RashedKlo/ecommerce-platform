using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DataAccess;
using DataAccess.DTOS;
using DataAccess.DTOS.OrderDetails;
using DataAccess.Repositories.OrderDetails;
using DataAccess.Services;


namespace BussinessAccess
{
    public class OrderDetail
    {
        public enum EnMode { Add = 1, Update = 2 }
        public EnMode Mode = EnMode.Add;
        public int OrderDetailID { get; set; }
        public int OrderID { get; set; }
        public int ProductID { get; set; }
        public string ProductName { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal Discount { get; set; }

        // public totalPrice

        public OrderDetail(OrderDetailDTO order, EnMode mode)
        {
            Mode = mode;
            this.OrderDetailID = order.OrderDetailID;
            this.ProductID = order.ProductID;
            this.UnitPrice = order.UnitPrice;
            this.Discount = order.Discount;
            this.Quantity = order.Quantity;
            this.OrderID = order.OrderID;
            this.ProductName = order.ProductName;
        }
        public OrderDetail(AddDTO order, EnMode mode)
        {
            Mode = mode;
            this.OrderDetailID = -1;
            this.ProductName = string.Empty;
            this.ProductID = order.ProductID;
            this.UnitPrice = order.UnitPrice;
            this.Discount = order.Discount;
            this.Quantity = order.Quantity;
            this.OrderID = order.OrderID;
        }
        public OrderDetail()
        {
            this.OrderDetailID = this.ProductID = this.OrderID = -1;
            this.UnitPrice = this.Discount = 0;
            this.ProductName = string.Empty;

        }
        public OrderDetailDTO OrderDetailDTO
        {
            get
            {
                return new OrderDetailDTO(OrderDetailID, ProductID, ProductName, OrderID, Quantity, UnitPrice, Discount);

            }
        }
        public AddDTO AddOrderDetailDTO
        {
            get
            {
                return new AddDTO
                {
                    ProductID = ProductID,
                    OrderID = OrderID,
                    Quantity = Quantity,
                    UnitPrice = UnitPrice,
                    Discount = Discount
                };
            }
        }


        public static async Task<OrderDetail> FindOrderDetailByID(int OrderDetailID)
        {
            if (OrderDetailID <= 0)
            {
                throw new InvalidOperationException("OrderDetailID not valid");
            }
            OrderDetailDTO OrderDetailDTO = await OrderDetailRepository.GetOrderDetailByIDAsync(OrderDetailID);
            if (OrderDetailDTO.OrderDetailID == -1)
            {
                throw new InvalidOperationException("OrderDetail not found");
            }
            else
                return new OrderDetail(OrderDetailDTO, EnMode.Update);
        }

        private async Task<bool> _AddOrderDetailAsync()
        {

            this.OrderDetailID = await OrderDetailRepository.AddOrderDetailAsync(AddOrderDetailDTO);
            if (this.OrderDetailID == -1)
            {
                throw new InvalidOperationException("Error adding Order Detail");
            }
            return this.OrderDetailID != -1;

        }
        private async Task<bool> _UpdateOrderDetail()
        {
            return await OrderDetailRepository.UpdateOrderDetailAsync(AddOrderDetailDTO, OrderDetailID);
        }
        public async Task<bool> SaveAsync()
        {
            switch (Mode)
            {
                case EnMode.Add:
                    if (await _AddOrderDetailAsync())
                    {
                        Mode = EnMode.Update;
                        return true;
                    }
                    return false;
                case EnMode.Update:
                    return await _UpdateOrderDetail();
                default:
                    return false;
            }
        }
        public static async Task<bool> IsOrderDetailExistByOrderID(int OrderID)
        {
            if (OrderID < 1)
            {
                throw new InvalidOperationException("OrderID not Valid");
            }
            return await OrderDetailRepository.IsOrderDetailExistedAsync(OrderID);
        }

        public static async Task<bool> DeleteOrderDetail(int OrderDetailID)
        {
            if (OrderDetailID < 1)
            {
                throw new InvalidOperationException("OrderDetail ID not Valid");
            }
            return await OrderDetailRepository.DeleteOrderDetailAsync(OrderDetailID);
        }
        public static async Task<IEnumerable<OrderDetailDTO>> GetOrdersDetails(int OrderID, int pageNumber, int LimitOfOrders)
        {
            if (pageNumber < 0)
            {
                pageNumber = 1;
            }
            if (LimitOfOrders < 0)
            {
                pageNumber = 1;
            }
            if (OrderID < 1)
            {
                throw new InvalidOperationException("Order ID not Valid");
            }
            return await OrderDetailRepository.GetAllOrderDetailsAsync(OrderID, new DataAccess.Services.PageFilter(pageNumber, LimitOfOrders));
        }

        private static DataAccess.Filters.FilterType.OrderDetails getOrderDetailsFilterType(string FilterType)
        {
            switch (FilterType.ToLower())
            {
                case "discount": return DataAccess.Filters.FilterType.OrderDetails.Discount;
                case "unitprice": return DataAccess.Filters.FilterType.OrderDetails.UnitPrice;
                case "productname": return DataAccess.Filters.FilterType.OrderDetails.ProductName;
                default: return DataAccess.Filters.FilterType.OrderDetails.ProductName;
            }
        }
        public static async Task<IEnumerable<OrderDetailDTO>> FilterAsync(int OrderID, string filterType, string value, int pageNumber, int LimitOfOrders)
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
            if (OrderID < 0)
            {
                throw new InvalidOperationException($"OrderID not Valid");

            }
            if (string.IsNullOrEmpty(filterType))
            {
                throw new InvalidOperationException($"{filterType} not Valid");
            }
            return await OrderDetailRepository.GetOrderDetailsByFilterAsync(getOrderDetailsFilterType(filterType), OrderID, new ValueFilter { value = value, page = new PageFilter(pageNumber, LimitOfOrders) });
        }

    }
}