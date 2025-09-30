using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DataAccess.DTOS.Country;
using DataAccess.DTOS.User;
using Microsoft.Data.SqlClient;

namespace DataAccess.Repositories.User.Queries
{
    public class GetUserByIDQuery
    {
        private const string query = @"
                    SELECT Users.UserID, Users.UserName,Users.Role, Users.Email, Users.BirthDate, Users.ProfilePicture,
                    Users.CreatedAt, Users.UpdatedAt, Countries.CountryID, Countries.Country
                    FROM Countries INNER JOIN Users 
                    ON Countries.CountryID = Users.CountryID 
                    WHERE Users.UserID=@ID";
        public static async Task<UserDTO> ExcuteAsync(int ID)
        {
            UserDTO user = new();


            using (var connection = new SqlConnection(clsDataAccessSettings.connectionString))
            using (var command = new SqlCommand(query, connection))
            {
                command.Parameters.AddWithValue("@ID", ID);

                try
                {
                    await connection.OpenAsync();
                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync())
                        {
                            user = new UserDTO
                         (
                             reader.GetInt32(reader.GetOrdinal("UserID")),
                             reader.GetString(reader.GetOrdinal("UserName")).Trim(),
                            reader.GetString(reader.GetOrdinal("Role")).Trim(),
                             reader.GetString(reader.GetOrdinal("Email")).Trim(),
                             reader.GetDateTime(reader.GetOrdinal("BirthDate")),
                            new CountryDTO(
                             reader.GetInt32(reader.GetOrdinal("CountryID")),
                            reader.GetString(reader.GetOrdinal("Country"))
                            ),
                          reader["ProfilePicture"] == DBNull.Value ? string.Empty :
                            reader.GetString(reader.GetOrdinal("ProfilePicture")),
                             reader.GetDateTime(reader.GetOrdinal("CreatedAt")),
                             reader.GetDateTime(reader.GetOrdinal("UpdatedAt"))
                         );

                        }
                    }
                }
                catch (Exception)
                {
                    // Log the exception (e.g., using a logging framework)
                    // Console.WriteLine("Error: " + ex.Message);
                }
            }

            return user;
        }

    }
}