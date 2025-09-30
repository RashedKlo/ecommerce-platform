using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DataAccess.DTOS.Category;
using DataAccess.Services;
using Microsoft.Data.SqlClient;

namespace DataAccess.Repositories.Category.Queries
{
    public class GetAllCategoriesQuery
    {
        private const string query = @"Select CategoryID,Title ,Description,Image,CreatedAt,UpdatedAt,
            (Select Count(CategoryID) from Categories) as TotalCategories from Categories
        ORDER BY CategoryID OFFSET @Offset ROWS FETCH NEXT @Limit ROWS ONLY";
        public static async Task<IEnumerable<CategoryDTO>> ExcuteAsyn(PageFilter page)
        {
            var Categories = new List<CategoryDTO>();
            int TotalCatgories = 0;
            int offset = (page.pageNumber - 1) * page.limitOfUsers;


            using (SqlConnection connection = new SqlConnection(clsDataAccessSettings.connectionString))
            using (SqlCommand command = new SqlCommand(query, connection))
            {
                command.Parameters.AddWithValue("@Offset", offset);
                command.Parameters.AddWithValue("@Limit", page.limitOfUsers);
                try
                {
                    await connection.OpenAsync();
                    using var reader = await command.ExecuteReaderAsync();
                    while (await reader.ReadAsync())
                    {
                        TotalCatgories = reader.GetInt32(reader.GetOrdinal("TotalCategories"));
                        Categories.Add(
                                  new CategoryDTO
                                  (
                    reader.GetInt32(reader.GetOrdinal("CategoryID")),
                    reader.GetString(reader.GetOrdinal("Title")).Trim(),
                    reader.GetString(reader.GetOrdinal("Description")).Trim(),
                    reader.GetString(reader.GetOrdinal("Image")).Trim(),
                    reader.GetDateTime(reader.GetOrdinal("CreatedAt")),
                    reader.GetDateTime(reader.GetOrdinal("UpdatedAt"))
                                 ));
                    }
                }
                catch (SqlException)
                {
                    // Log SQL exceptions
                    // _logger.LogError(sqlEx, "An SQL error occurred while fetching users.");
                    throw; // Optionally rethrow the exception or handle it as needed
                }
                catch (Exception)
                {
                    // Log general exceptions
                    // _logger.LogError(ex, "An error occurred while fetching users.");
                    throw; // Optionally rethrow the exception or handle it as needed
                }
            }

            return Categories;
        }

    }
}