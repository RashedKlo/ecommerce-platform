using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DataAccess.DTOS.Country;
using Microsoft.Data.SqlClient;

namespace DataAccess.Repositories.Country.Queries
{
    public class GetCountryByIDQuery
    {
        private const string query = @"SELECT CountryID,Country FROM Countries WHERE CountryID=@CountryID";

        async static public Task<CountryDTO> ExcuteAsync(int CountryID)
        {
            CountryDTO country = new();

            using (var connection = new SqlConnection(clsDataAccessSettings.connectionString))
            using (var command = new SqlCommand(query, connection))
            {
                command.Parameters.AddWithValue("@CountryID", CountryID);

                try
                {
                    await connection.OpenAsync();
                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync())
                        {
                            country = new CountryDTO
                            (
                                reader.GetInt32(reader.GetOrdinal("CountryID")),
                                reader.GetString(reader.GetOrdinal("Country")).Trim()
                            );
                        }
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
            return country;
        }


    }
}