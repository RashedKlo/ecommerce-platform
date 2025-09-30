using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DataAccess.DTOS.Order;
using Microsoft.Data.SqlClient;

namespace DataAccess.Repositories.Order.Queries
{
    public class GetOrderByIDQuery
    {
        private const string query = @"SELECT Orders.OrderID, Orders.UserID, Users.UserName, Orders.OrderDate,
             TotalAmount=(select   SUM((UnitPrice * Quantity)*(1-Discount/100)) from OrderDetails where OrderID=Orders.OrderID)
			 , Orders.OrderStatus, Orders.PaymentMethod, Orders.Discount, (Select Count(OrderID) from Orders) as TotalOrders
            FROM Orders  INNER JOIN Users ON Orders.UserID = Users.UserID
             where OrderID=@OrderID";
        public static async Task<OrderDTO> ExcuteAsync(int OrderID)
        {
            OrderDTO ordersDTO = new();


            using (var connection = new SqlConnection(clsDataAccessSettings.connectionString))
            using (var command = new SqlCommand(query, connection))
            {
                command.Parameters.AddWithValue("@OrderID", OrderID);

                try
                {
                    await connection.OpenAsync();
                    using var reader = await command.ExecuteReaderAsync();
                    if (await reader.ReadAsync())
                    {
                        ordersDTO = new OrderDTO
                    (
                        reader.GetInt32(reader.GetOrdinal("OrderID")),
                        reader.GetInt32(reader.GetOrdinal("UserID")),
                        reader.GetString(reader.GetOrdinal("UserName")),
                        reader.GetDateTime(reader.GetOrdinal("OrderDate")),
                        reader.GetDecimal(reader.GetOrdinal("TotalAmount")),
                        reader.GetByte(reader.GetOrdinal("OrderStatus")),
                        reader.GetDecimal(reader.GetOrdinal("Discount")),
                        reader.GetString(reader.GetOrdinal("PaymentMethod"))
                    );
                    }
                }
                catch (Exception)
                {
                    // Handle the exception (e.g., log it)
                    // Console.WriteLine("Error: " + ex.Message);
                    throw;
                }
            }

            return ordersDTO;
        }


    }
}