using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DataAccess.DTOS.Category;
using Microsoft.Data.SqlClient;

namespace DataAccess.Repositories.Category.Queries
{
    public class GetSearchCategoriesQuery
    {
        private const string query = @"Select CategoryID,Title  from Categories ORDER BY CategoryID";

        public static async Task<IEnumerable<SearchDTO>> ExcuteAsync()
        {
            var Categories = new List<SearchDTO>();


            using (SqlConnection connection = new SqlConnection(clsDataAccessSettings.connectionString))
            using (SqlCommand command = new SqlCommand(query, connection))
            {

                try
                {
                    await connection.OpenAsync();
                    using var reader = await command.ExecuteReaderAsync();
                    while (await reader.ReadAsync())
                    {
                        Categories.Add(
                                  new SearchDTO
                                  (
                    reader.GetInt32(reader.GetOrdinal("CategoryID")),
                    reader.GetString(reader.GetOrdinal("Title")).Trim()
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