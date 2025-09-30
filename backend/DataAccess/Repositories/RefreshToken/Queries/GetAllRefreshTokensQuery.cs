using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DataAccess.DTOS.RefreshToken;
using Microsoft.Data.SqlClient;

namespace DataAccess.Repositories.RefreshToken.Queries
{
    public class GetAllRefreshTokensQuery
    {
        public static async Task<List<RefreshTokenDTO>> ExcuteAsync()
        {
            var Tokens = new List<RefreshTokenDTO>();
            string query = @"SELECT * From RefreshTokens";
            using (SqlConnection connection = new SqlConnection(clsDataAccessSettings.connectionString))
            using (SqlCommand command = new SqlCommand(query, connection))
            {
                try
                {
                    await connection.OpenAsync();
                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            Tokens.Add(new RefreshTokenDTO
                   (
                       reader.GetInt32(reader.GetOrdinal("ID")),
                       reader.GetInt32(reader.GetOrdinal("UserID")),
                       reader.GetString(reader.GetOrdinal("Token")).Trim(),
                       reader.GetDateTime(reader.GetOrdinal("TokenCreated")),
                       reader.GetDateTime(reader.GetOrdinal("Expires")),
reader.GetBoolean(reader.GetOrdinal("IsRevoked"))
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
            return Tokens;
        }


    }
}