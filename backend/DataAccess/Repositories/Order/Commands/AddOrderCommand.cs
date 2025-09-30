using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DataAccess.DTOS.Order;
using Microsoft.Data.SqlClient;

namespace DataAccess.Repositories.Order.Commands
{
    public class AddOrderCommand
    {
        private const string query = @"Insert Into Orders(UserID,OrderStatus,TotalAmount,OrderDate,Discount,PaymentMethod) 
            Values(@UserID,@OrderStatus,@TotalAmount,@OrderDate,@Discount,@PaymentMethod)  SELECT SCOPE_IDENTITY()";

        public static async Task<int> ExcuteAsync(AddDTO ordersDTO)
        {

            int personID = -1;

            using (SqlConnection connection = new SqlConnection(clsDataAccessSettings.connectionString))
            using (SqlCommand command = new SqlCommand(query, connection))
            {
                command.Parameters.AddWithValue("UserID", ordersDTO.UserID);
                command.Parameters.AddWithValue("OrderStatus", ordersDTO.OrderStatus);
                command.Parameters.AddWithValue("OrderDate", DateTime.UtcNow);
                command.Parameters.AddWithValue("Discount", ordersDTO.Discount);
                command.Parameters.AddWithValue("TotalAmount", 0);
                command.Parameters.AddWithValue("PaymentMethod", ordersDTO.PaymentMethod);

                try
                {
                    await connection.OpenAsync();
                    var result = await command.ExecuteScalarAsync();
                    if (result != null && int.TryParse(result.ToString(), out int insertedID))
                    {
                        personID = insertedID;
                    }
                }
                catch (SqlException)
                {
                    // Log SQL exceptions
                    // _logger.LogError(sqlEx, "An SQL error occurred while adding the user.");
                    throw; // Optionally rethrow the exception or handle it as needed
                }
                catch (Exception)
                {
                    // Log general exceptions
                    // _logger.LogError(ex, "An error occurred while adding the user.");
                    throw; // Optionally rethrow the exception or handle it as needed
                }
            }

            return personID;
        }

    }
}