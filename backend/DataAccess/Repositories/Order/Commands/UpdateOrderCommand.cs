using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DataAccess.DTOS.Order;
using Microsoft.Data.SqlClient;

namespace DataAccess.Repositories.Order.Commands
{
    public class UpdateOrderCommand
    {
        private const string query = @"Update Orders
            Set UserID=@UserID,OrderDate=@OrderDate,OrderStatus=@OrderStatus,Discount=@Discount,PaymentMethod=@PaymentMethod where OrderID=@OrderID";

        public static async Task<bool> ExcuteAsync(AddDTO orders, int OrderID)
        {

            using (SqlConnection connection = new SqlConnection(clsDataAccessSettings.connectionString))
            using (SqlCommand command = new SqlCommand(query, connection))
            {
                command.Parameters.AddWithValue("OrderID", OrderID);
                command.Parameters.AddWithValue("UserID", orders.UserID);
                command.Parameters.AddWithValue("OrderDate", DateTime.UtcNow);

                command.Parameters.AddWithValue("Discount", orders.Discount);
                command.Parameters.AddWithValue("PaymentMethod", orders.PaymentMethod);
                command.Parameters.AddWithValue("OrderStatus", orders.OrderStatus);
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