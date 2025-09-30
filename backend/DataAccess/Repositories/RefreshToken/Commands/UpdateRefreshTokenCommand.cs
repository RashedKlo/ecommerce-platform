using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DataAccess.DTOS.RefreshToken;
using Microsoft.Data.SqlClient;

namespace DataAccess.Repositories.RefreshToken.Commands
{
    public class UpdateRefreshTokenCommand
    {
        public static async Task<bool> ExcuteAsync(RefreshTokenDTO tokenDTO)
        {

            string query = @"Update RefreshTokens
            Set UserID=@UserID,Token=@Token,TokenCreated=@TokenCreated,Expires=@Expires,IsRevoked=@IsRevoked where ID=@ID";

            using (SqlConnection connection = new SqlConnection(clsDataAccessSettings.connectionString))
            using (SqlCommand command = new SqlCommand(query, connection))
            {
                command.Parameters.AddWithValue("UserID", tokenDTO.UserID);
                command.Parameters.AddWithValue("Token", tokenDTO.Token);
                command.Parameters.AddWithValue("TokenCreated", tokenDTO.TokenCreated);
                command.Parameters.AddWithValue("Expires", tokenDTO.Expires);
                command.Parameters.AddWithValue("Expires", tokenDTO.IsRevoked);
                command.Parameters.AddWithValue("ID", tokenDTO.ID);
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