using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DataAccess.DTOS.Country;
using DataAccess.DTOS.User;
using Microsoft.Data.SqlClient;

namespace DataAccess.Repositories.RefreshToken.Queries
{
    public class GetUserByTokenQuery
    {
        async public static Task<UserDTO> ExcuteAsync(string Token)
        {
            UserDTO User = new();
            string query = @"SELECT  Users.UserID, Users.UserName, Users.Email,Users.BirthDate,Users.Role,Users.CreatedAt,Users.UpdatedAt
FROM    RefreshTokens INNER JOIN  Users ON RefreshTokens.UserID = Users.UserID	 where RefreshTokens.Token=@Token and RefreshTokens.IsRevoked=0;";

            using (var connection = new SqlConnection(clsDataAccessSettings.connectionString))
            using (var command = new SqlCommand(query, connection))
            {
                command.Parameters.AddWithValue("@Token", Token);
                try
                {
                    await connection.OpenAsync();
                    using var reader = await command.ExecuteReaderAsync();
                    if (await reader.ReadAsync())
                    {
                        User = new UserDTO
                                (
                                                       reader.GetInt32(reader.GetOrdinal("UserID")),
                                                       reader.GetString(reader.GetOrdinal("UserName")).Trim(),
                                             reader.GetString(reader.GetOrdinal("Email")).Trim(),
                                             reader.GetString(reader.GetOrdinal("Role")).Trim(),
                                                       reader.GetDateTime(reader.GetOrdinal("BirthDate")),
                                 new CountryDTO(
                                reader.GetInt32(reader.GetOrdinal("CountryID")),
                                                   reader.GetString(reader.GetOrdinal("Country"))
                                                   ),
                                                       reader.GetString(reader.GetOrdinal("ProfilePicture")).Trim(),
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

            return User;
        }

    }
}