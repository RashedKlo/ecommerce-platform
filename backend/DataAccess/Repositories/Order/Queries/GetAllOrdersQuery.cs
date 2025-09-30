using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DataAccess.DTOS.Order;
using DataAccess.Services;
using Microsoft.Data.SqlClient;

namespace DataAccess.Repositories.Order.Queries
{
    public class GetAllOrdersQuery
    {
        private const string query = @"SELECT Orders.OrderID, Orders.UserID, Users.UserName, Orders.OrderDate,
             TotalAmount=(select   SUM((UnitPrice * Quantity)*(1-Discount/100)) from OrderDetails where OrderID=Orders.OrderID)
			 , Orders.OrderStatus, Orders.PaymentMethod, Orders.Discount, (Select Count(OrderID) from Orders) as TotalOrders
            FROM Orders  INNER JOIN Users ON Orders.UserID = Users.UserID
            ORDER BY OrderID OFFSET @Offset ROWS FETCH NEXT @Limit ROWS ONLY";
        public static async Task<IEnumerable<OrderDTO>> ExcuteAsync(PageFilter page)
        {
            var Orders = new List<OrderDTO>();
            int TotalOrders = 0;
            int offset = (page.pageNumber - 1) * page.limitOfUsers;


            using (SqlConnection connection = new SqlConnection(clsDataAccessSettings.connectionString))
            using (SqlCommand command = new SqlCommand(query, connection))
            {
                command.Parameters.AddWithValue("@Offset", offset);
                command.Parameters.AddWithValue("@Limit", page.limitOfUsers);
                try
                {
                    await connection.OpenAsync();
                    using var reader = await command.ExecuteReaderAsync();
                    while (await reader.ReadAsync())
                    {
                        TotalOrders = reader.GetInt32(reader.GetOrdinal("TotalOrders"));
                        Orders.Add(
                              new OrderDTO
                    (
                        reader.GetInt32(reader.GetOrdinal("OrderID")),
                        reader.GetInt32(reader.GetOrdinal("UserID")),
                        reader.GetString(reader.GetOrdinal("UserName")),
                        reader.GetDateTime(reader.GetOrdinal("OrderDate")),
                       reader["TotalAmount"] != DBNull.Value ? reader.GetDecimal(reader.GetOrdinal("TotalAmount")) : 0,
                        reader.GetByte(reader.GetOrdinal("OrderStatus")),
                        reader.GetDecimal(reader.GetOrdinal("Discount")),
                        reader.GetString(reader.GetOrdinal("PaymentMethod"))
                    ));
                    }
                }
                catch (SqlException)
                {
                    // Log SQL exceptions
                    // _logger.LogError(sqlEx, "An SQL error occurred while fetching users.");
                    throw; // Optionally rethrow the exception or handle it as needed
                }
                catch (Exception)
                {
                    // Log general exceptions
                    // _logger.LogError(ex, "An error occurred while fetching users.");
                    throw; // Optionally rethrow the exception or handle it as needed
                }
            }

            return Orders;
        }

    }
}