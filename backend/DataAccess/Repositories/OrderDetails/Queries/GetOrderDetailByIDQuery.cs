using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DataAccess.DTOS.OrderDetails;
using Microsoft.Data.SqlClient;

namespace DataAccess.Repositories.OrderDetails.Queries
{
    public class GetOrderDetailByIDQuery
    {
        private const string query = @" SELECT OrderDetails.OrderDetailID, OrderDetails.ProductID, Products.ProductName,
OrderDetails.UnitPrice,OrderDetails.Discount, OrderDetails.Quantity
FROM OrderDetails INNER JOIN Products ON OrderDetails.ProductID = Products.ProductID
where OrderDetailID=@OrderDetailID";
        public static async Task<OrderDetailDTO> ExcuteAsync(int OrderDetailID)
        {
            OrderDetailDTO orderDetailsDTO = new();


            using (var connection = new SqlConnection(clsDataAccessSettings.connectionString))
            using (var command = new SqlCommand(query, connection))
            {
                command.Parameters.AddWithValue("@OrderDetailID", OrderDetailID);

                try
                {
                    await connection.OpenAsync();
                    using var reader = await command.ExecuteReaderAsync();
                    if (await reader.ReadAsync())
                    {
                        orderDetailsDTO = new OrderDetailDTO
                    (
                        reader.GetInt32(reader.GetOrdinal("OrderDetailID")),
                        reader.GetInt32(reader.GetOrdinal("ProductID")),
                        reader.GetString(reader.GetOrdinal("ProductName")),
                        reader.GetInt32(reader.GetOrdinal("OrderID")),
                        reader.GetInt32(reader.GetOrdinal("Quantity")),
                        reader.GetDecimal(reader.GetOrdinal("UnitPrice")),
                        reader.GetDecimal(reader.GetOrdinal("Discount"))
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

            return orderDetailsDTO;
        }

    }
}