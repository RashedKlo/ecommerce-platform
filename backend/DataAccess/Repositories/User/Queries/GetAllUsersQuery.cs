using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DataAccess.DTOS.Country;
using DataAccess.DTOS.User;
using DataAccess.Services;
using Microsoft.Data.SqlClient;

namespace DataAccess.Repositories.User.Queries
{
    public class GetAllUsersQuery
    {
        private const string query = @"
               SELECT Users.UserID, Users.UserName,Users.Role, Users.Email, Users.BirthDate, Users.ProfilePicture, Users.CreatedAt,
               Users.UpdatedAt, Countries.CountryID, Countries.Country, (Select Count(Users.UserID)From Users) AS TotalUsers
               FROM Countries INNER JOIN
               Users ON Countries.CountryID = Users.CountryID
               ORDER BY UserID OFFSET @Offset ROWS FETCH NEXT @Limit ROWS ONLY";
        public static async Task<List<UserDTO>> ExcuteAsync(PageFilter page)
        {
            var usersList = new List<UserDTO>();
            int TotalUsers = 0;
            int offset = (page.pageNumber - 1) * page.limitOfUsers;
            using (SqlConnection connection = new SqlConnection(clsDataAccessSettings.connectionString))
            using (SqlCommand command = new SqlCommand(query, connection))
            {
                command.Parameters.AddWithValue("@Offset", offset);
                command.Parameters.AddWithValue("@Limit", page.limitOfUsers);
                try
                {
                    await connection.OpenAsync();
                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            TotalUsers = reader.GetInt32(reader.GetOrdinal("TotalUsers"));
                            usersList.Add(new UserDTO
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
            return usersList;
        }

    }
}