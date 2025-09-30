using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DataAccess.DTOS.OrderDetails;
using DataAccess.Filters;
using DataAccess.Repositories.OrderDetails.Commands;
using DataAccess.Repositories.OrderDetails.Queries;
using DataAccess.Services;

namespace DataAccess.Repositories.OrderDetails
{
    public class OrderDetailRepository
    {
        public async static Task<int> AddOrderDetailAsync(AddDTO orderDetailsDTO)
        {
            return await AddOrderDetailCommand.ExcuteAsync(orderDetailsDTO);
        }
        public async static Task<bool> DeleteOrderDetailAsync(int OrderDetailID)
        {
            return await DeleteOrderDetailCommand.ExcuteAsync(OrderDetailID);
        }
        public async static Task<bool> UpdateOrderDetailAsync(AddDTO orderDetails, int OrderDetailID)
        {
            return await UpdateOrderDetailCommand.ExcuteAsync(orderDetails, OrderDetailID);
        }
        public async static Task<IEnumerable<OrderDetailDTO>> GetAllOrderDetailsAsync(int OrderID, PageFilter page)
        {
            return await GetAllOrderDetailsQuery.ExcuteAsync(OrderID, page);
        }
        public async static Task<OrderDetailDTO> GetOrderDetailByIDAsync(int OrderDetailID)
        {
            return await GetOrderDetailByIDQuery.ExcuteAsync(OrderDetailID);
        }
        public async static Task<IEnumerable<OrderDetailDTO>> GetOrderDetailsByFilterAsync(FilterType.OrderDetails Type, int OrderID, ValueFilter valueFilter)
        {
            return await GetOrderDetailsByFilterQuery.ExcuteAsync(Type, OrderID, valueFilter);
        }
        public async static Task<bool> IsOrderDetailExistedAsync(int OrderID)
        {
            return await IsOrderDetailIDExistedQuery.ExcuteAsync(OrderID);
        }

    }
}