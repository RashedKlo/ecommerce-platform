using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;

namespace DataAccess.Repositories.Product.Queries
{
    public class IsProductIDExistedQuery
    {
        private const string query = @"SELECT 1 FROM Products WHERE ProductID = @ProductID";
        public static async Task<bool> ExcuteAsync(int ProductID)
        {
            bool isExisted = false;


            using (SqlConnection connection = new SqlConnection(clsDataAccessSettings.connectionString))
            using (SqlCommand command = new SqlCommand(query, connection))
            {
                command.Parameters.AddWithValue("@ProductID", ProductID);

                try
                {
                    await connection.OpenAsync();
                    var result = await command.ExecuteScalarAsync();
                    if (result != null && int.TryParse(result.ToString(), out int inserted))
                    {
                        isExisted = inserted == 1;
                    }
                }
                catch (SqlException)
                {
                    // Log SQL exceptions
                    // _logger.LogError(sqlEx, "An SQL error occurred while checking if the email exists.");
                    throw; // Optionally rethrow the exception or handle it as needed
                }
                catch (Exception)
                {
                    // Log general exceptions
                    // _logger.LogError(ex, "An error occurred while checking if the email exists.");
                    throw; // Optionally rethrow the exception or handle it as needed
                }
            }

            return isExisted;
        }

    }
}