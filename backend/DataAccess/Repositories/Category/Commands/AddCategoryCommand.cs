using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DataAccess.DTOS.Category;
using Microsoft.Data.SqlClient;

namespace DataAccess.Repositories.Category.Commands
{
    public class AddCategoryCommand
    {
        private const string query = @"Insert Into Categories(Title,Image,Description,CreatedAt,UpdatedAt) 
            Values(@Title,@Image,@Description,@CreatedAt,@UpdatedAt)  SELECT SCOPE_IDENTITY()";
        public static async Task<int> ExcuteAsync(AddDTO Categroy)
        {

            int personID = -1;

            using (SqlConnection connection = new SqlConnection(clsDataAccessSettings.connectionString))
            using (SqlCommand command = new SqlCommand(query, connection))
            {
                command.Parameters.AddWithValue("Title", Categroy.Title);
                command.Parameters.AddWithValue("Image", Categroy.Image);
                command.Parameters.AddWithValue("Description", Categroy.Description);
                command.Parameters.AddWithValue("CreatedAt", DateTime.UtcNow);
                command.Parameters.AddWithValue("UpdatedAt", DateTime.UtcNow);

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