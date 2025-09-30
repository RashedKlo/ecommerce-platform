using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DataAccess.DTOS.Category;
using Microsoft.Data.SqlClient;

namespace DataAccess.Repositories.Category.Queries
{
    public class GetCategoryByIDQuery
    {
        private const string query = @" Select CategoryID,Title ,Description,Image,CreatedAt,UpdatedAt from Categories
             where CategoryID=@CategoryID";
        public static async Task<CategoryDTO> ExcuteAsync(int CategoryID)
        {
            CategoryDTO Category = new();


            using (var connection = new SqlConnection(clsDataAccessSettings.connectionString))
            using (var command = new SqlCommand(query, connection))
            {
                command.Parameters.AddWithValue("@CategoryID", CategoryID);

                try
                {
                    await connection.OpenAsync();
                    using var reader = await command.ExecuteReaderAsync();
                    if (await reader.ReadAsync())
                    {
                        Category = new CategoryDTO
                    (
                        reader.GetInt32(reader.GetOrdinal("CategoryID")),
                        reader.GetString(reader.GetOrdinal("Title")).Trim(),
                        reader.GetString(reader.GetOrdinal("Description")).Trim(),
                        reader.GetString(reader.GetOrdinal("Image")).Trim(),
                        reader.GetDateTime(reader.GetOrdinal("CreatedAt")),
                        reader.GetDateTime(reader.GetOrdinal("UpdatedAt"))
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

            return Category;
        }

    }
}