using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DataAccess.DTOS.OrderDetails;
using Microsoft.Data.SqlClient;

namespace DataAccess.Repositories.OrderDetails.Commands
{
    public class UpdateOrderDetailCommand
    {
        public static async Task<bool> ExcuteAsync(AddDTO orderDetails, int OrderDetailID)
        {
            string query = @"Update OrderDetails
            Set ProductID=@ProductID,OrderID=@OrderID,Quantity=@Quantity,UnitPrice=@UnitPrice,Discount=@Discount where OrderDetailID=@OrderDetailID";

            using (SqlConnection connection = new SqlConnection(clsDataAccessSettings.connectionString))
            using (SqlCommand command = new SqlCommand(query, connection))
            {
                command.Parameters.AddWithValue("OrderDetailID", OrderDetailID);
                command.Parameters.AddWithValue("ProductID", orderDetails.ProductID);
                command.Parameters.AddWithValue("OrderID", orderDetails.OrderID);
                command.Parameters.AddWithValue("Quantity", orderDetails.Quantity);
                command.Parameters.AddWithValue("UnitPrice", orderDetails.UnitPrice);
                command.Parameters.AddWithValue("Discount", orderDetails.Discount);
                try
                {
                    await connection.OpenAsync();
                    int rowsAffected = await command.ExecuteNonQueryAsync();
                    return rowsAffected > 0;
                }
                catch (SqlException)
                {
                    // Log SQL exceptions
                    // _logger.LogError(sqlEx, "An SQL error occurred while updating the user.");
                    throw; // Optionally rethrow the exception or handle it as needed
                }
                catch (Exception)
                {
                    // Log general exceptions
                    // _logger.LogError(ex, "An error occurred while updating the user.");
                    throw; // Optionally rethrow the exception or handle it as needed
                }
            }
        }


    }
}