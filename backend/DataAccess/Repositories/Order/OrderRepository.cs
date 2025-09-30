using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DataAccess.DTOS.Order;
using DataAccess.Filters;

using DataAccess.Repositories.Order.Commands;
using DataAccess.Repositories.Order.Queries;
using DataAccess.Services;

namespace DataAccess.Repositories.Order
{
    public class OrderRepository
    {
        public static async Task<int> AddOrderAsync(AddDTO ordersDTO)
        {
            return await AddOrderCommand.ExcuteAsync(ordersDTO);
        }
        public async static Task<bool> DeleteOrderAsync(int OrderID)
        {
            return await DeleteOrderCommand.ExcuteAsync(OrderID);
        }
        public async static Task<bool> UpdateOrderAsync(AddDTO orders, int OrderID)
        {
            return await UpdateOrderCommand.ExcuteAsync(orders, OrderID);
        }
        public async static Task<IEnumerable<OrderDTO>> GetAllOrdersAsync(PageFilter page)
        {
            return await GetAllOrdersQuery.ExcuteAsync(page);
        }
        public async static Task<IEnumerable<OrderDTO>> GetOrdersByFilterAsync(FilterType.Order Type, ValueFilter filter)
        {
            return await GetOrdersByFilterQuery.ExcuteAsync(Type, filter);
        }
        public async static Task<OrderDTO> GetOrderByID(int OrderID)
        {
            return await GetOrderByID(OrderID);
        }
        public async static Task<bool> IsOrderIDExistedAsync(int OrderID)
        {
            return await IsOrderIDExistedQuery.ExcuteAsync(OrderID);
        }
    }
}