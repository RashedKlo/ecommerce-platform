using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DataAccess.DTOS.Country;
using Microsoft.Data.SqlClient;

namespace DataAccess.Repositories.Country.Queries
{
    public class GetAllCountriesQuery
    {
        private const string query = @"SELECT CountryID,Country FROM Countries order by Country";

        async static public Task<IEnumerable<CountryDTO>> ExcuteAsync()
        {
            List<CountryDTO> countries = new();
            using (var connection = new SqlConnection(clsDataAccessSettings.connectionString))
            using (var command = new SqlCommand(query, connection))
            {

                try
                {
                    await connection.OpenAsync();
                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            countries.Add(new CountryDTO
                            (
                                reader.GetInt32(reader.GetOrdinal("CountryID")),
                                reader.GetString(reader.GetOrdinal("Country")).Trim()
                            ));
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
            return countries;
        }


    }
}