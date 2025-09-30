using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DataAccess.DTOS.Product.Image;
using Microsoft.Data.SqlClient;

namespace DataAccess.Repositories.Product.Commands
{
    public class AddProductImageCommand
    {
        private const string query = @"Insert Into ProductsImages(ProductID,Image,CreatedAt,UpdatedAt) 
            Values(@ProductID,@Image,@CreatedAt,@UpdatedAt)  SELECT SCOPE_IDENTITY()";
        public static async Task<int> ExcuteAsync(ImageDTO ProductImageDTO, int ProductID)
        {

            int personID = -1;

            using (SqlConnection connection = new SqlConnection(clsDataAccessSettings.connectionString))
            using (SqlCommand command = new SqlCommand(query, connection))
            {
                command.Parameters.AddWithValue("ProductID", ProductID);
                command.Parameters.AddWithValue("Image", ProductImageDTO.Image);
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