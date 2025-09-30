using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DataAccess.DTOS.RefreshToken;
using Microsoft.Data.SqlClient;

namespace DataAccess.Repositories.RefreshToken.Queries
{
    public class GetRefreshTokenByIDQuery
    {
        async public static Task<RefreshTokenDTO> ExcuteAsync(int ID)
        {
            RefreshTokenDTO tokenDTO = new();
            string query = @"select * From RefreshTokens where ID=@ID and Revoked is Null";

            using (var connection = new SqlConnection(clsDataAccessSettings.connectionString))
            using (var command = new SqlCommand(query, connection))
            {
                command.Parameters.AddWithValue("@ID", ID);

                try
                {
                    await connection.OpenAsync();
                    using var reader = await command.ExecuteReaderAsync();
                    if (await reader.ReadAsync())
                    {
                        tokenDTO = new RefreshTokenDTO
                      (
                          reader.GetInt32(reader.GetOrdinal("ID")),
                          reader.GetInt32(reader.GetOrdinal("UserID")),
                          reader.GetString(reader.GetOrdinal("Token")).Trim(),
                          reader.GetDateTime(reader.GetOrdinal("TokenCreated")),
                          reader.GetDateTime(reader.GetOrdinal("Expires")),
                          reader.GetBoolean(reader.GetOrdinal("IsRevoked"))
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

            return tokenDTO;
        }

    }
}