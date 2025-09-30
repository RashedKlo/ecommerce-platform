using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;

namespace DataAccess.Repositories.Category.Queries
{
    public class IsCategoryTitleExistedQuery
    {
        private const string query = @"SELECT 1 FROM Categories WHERE Title = @Title";

        public static async Task<bool> ExcuteAsync(string Title)
        {
            bool isExisted = false;

            using (SqlConnection connection = new SqlConnection(clsDataAccessSettings.connectionString))
            using (SqlCommand command = new SqlCommand(query, connection))
            {
                command.Parameters.AddWithValue("@Title", Title);

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