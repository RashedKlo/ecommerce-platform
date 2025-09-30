using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DataAccess.DTOS.RefreshToken;
using Microsoft.Data.SqlClient;

namespace DataAccess.Repositories.RefreshToken.Commands
{
    public class AddRefreshTokenCommand
    {
        private const string query = @"INSERT INTO RefreshTokens(UserID,Token,TokenCreated,Expires,IsRevoked)
                             VALUES(@UserID,@Token,@TokenCreated,@Expires,@IsRevoked);
                             SELECT SCOPE_IDENTITY()";
        async public static Task<int> ExcuteAsync(RefreshTokenDTO tokenDTO)
        {

            int personID = -1;

            using (SqlConnection connection = new SqlConnection(clsDataAccessSettings.connectionString))
            using (SqlCommand command = new SqlCommand(query, connection))
            {

                command.Parameters.AddWithValue("UserID", tokenDTO.UserID);
                command.Parameters.AddWithValue("Token", tokenDTO.Token);
                command.Parameters.AddWithValue("TokenCreated", DateTime.UtcNow);
                command.Parameters.AddWithValue("Expires", tokenDTO.Expires);
                command.Parameters.AddWithValue("IsRevoked", false);

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