using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;

namespace DataAccess.Repositories.Order.Commands
{
    public class DeleteOrderCommand
    {
        private const string query = @"DELETE FROM Orders WHERE OrderID=@OrderID;";

        public static async Task<bool> ExcuteAsync(int OrderID)
        {
            bool isDeleted = false;
            // DELETE FROM RefreshTokens WHERE OrderID=@OrderID

            using (SqlConnection connection = new SqlConnection(clsDataAccessSettings.connectionString))
            using (SqlCommand command = new SqlCommand(query, connection))
            {
                command.Parameters.AddWithValue("@OrderID", OrderID);

                try
                {
                    await connection.OpenAsync();
                    int rowsAffected = await command.ExecuteNonQueryAsync();
                    isDeleted = rowsAffected > 0;
                }
                catch (SqlException)
                {
                    // Log SQL exceptions
                    // _logger.LogError(sqlEx, "An SQL error occurred while deleting the user.");
                    throw; // Optionally rethrow the exception or handle it as needed
                }
                catch (Exception)
                {
                    // Log general exceptions
                    // _logger.LogError(ex, "An error occurred while deleting the user.");
                    throw; // Optionally rethrow the exception or handle it as needed
                }
            }

            return isDeleted;
        }

    }
}