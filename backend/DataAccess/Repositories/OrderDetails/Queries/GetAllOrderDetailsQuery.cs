using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DataAccess.DTOS.OrderDetails;
using DataAccess.Services;
using Microsoft.Data.SqlClient;

namespace DataAccess.Repositories.OrderDetails.Queries
{
    public class GetAllOrderDetailsQuery
    {
        private const string query = @"SELECT OrderDetails.OrderDetailID, OrderDetails.ProductID, Products.ProductName,
OrderDetails.UnitPrice,OrderDetails.Discount, OrderDetails.Quantity,(Select Count(OrderDetailID) 
from OrderDetails where OrderID=@OrderID) as TotalOrderDetails
FROM OrderDetails INNER JOIN Products ON OrderDetails.ProductID = Products.ProductID
where OrderID=@OrderID
ORDER BY OrderDetailID OFFSET @Offset ROWS FETCH NEXT @Limit ROWS ONLY";
        public static async Task<IEnumerable<OrderDetailDTO>> ExcuteAsync(int OrderID, PageFilter page)
        {
            var OrderDetails = new List<OrderDetailDTO>();
            int TotalOrders = 0;
            int offset = (page.pageNumber - 1) * page.limitOfUsers;


            using (SqlConnection connection = new SqlConnection(clsDataAccessSettings.connectionString))
            using (SqlCommand command = new SqlCommand(query, connection))
            {
                command.Parameters.AddWithValue("@Offset", offset);
                command.Parameters.AddWithValue("@OrderID", OrderID);
                command.Parameters.AddWithValue("@Limit", page.limitOfUsers);
                try
                {
                    await connection.OpenAsync();
                    using var reader = await command.ExecuteReaderAsync();
                    while (await reader.ReadAsync())
                    {
                        TotalOrders = reader.GetInt32(reader.GetOrdinal("TotalOrderDetails"));
                        OrderDetails.Add(
                               new OrderDetailDTO
                    (
                        reader.GetInt32(reader.GetOrdinal("OrderDetailID")),
                        reader.GetInt32(reader.GetOrdinal("ProductID")),
                        reader.GetString(reader.GetOrdinal("ProductName")),
                        OrderID,
                        reader.GetInt32(reader.GetOrdinal("Quantity")),
                        reader.GetDecimal(reader.GetOrdinal("UnitPrice")),
                        reader.GetDecimal(reader.GetOrdinal("Discount"))
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

            return OrderDetails;
        }

    }
}