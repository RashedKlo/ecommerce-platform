using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DataAccess.DTOS.Category;
using Microsoft.Data.SqlClient;

namespace DataAccess.Repositories.Category.Commands
{
    public class UpdateCategoryCommand
    {
        private const string query = @"Update Categories
            Set Title=@Title,Image=@Image,Description=@Description where CategoryID=@CategoryID";

        public static async Task<bool> ExcuteAsync(AddDTO categroy, int CategoryID)
        {

            using (SqlConnection connection = new SqlConnection(clsDataAccessSettings.connectionString))
            using (SqlCommand command = new SqlCommand(query, connection))
            {
                command.Parameters.AddWithValue("CategoryID", CategoryID);
                command.Parameters.AddWithValue("Title", categroy.Title);
                command.Parameters.AddWithValue("Image", categroy.Image);
                command.Parameters.AddWithValue("Description", categroy.Description);
                command.Parameters.AddWithValue("CreatedAt", DateTime.UtcNow);
                command.Parameters.AddWithValue("UpdatedAt", DateTime.UtcNow);

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