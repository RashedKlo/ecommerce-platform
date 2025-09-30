using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DataAccess.DTOS.User;
using Microsoft.Data.SqlClient;

namespace DataAccess.Repositories.User.Commands
{
    public class UpdateUserCommand
    {

        public static async Task<bool> ExcuteAsync(UpdateDTO newUserDTO, int UserID)
        {
            string query = @"UPDATE Users
                     SET UserName=@UserName,Role=@Role,BirthDate=@BirthDate, ProfilePicture=@ProfilePicture,
                     UpdatedAt=@UpdatedAt,CountryID=@CountryID
                     WHERE UserID=@UserID";

            using (SqlConnection connection = new SqlConnection(clsDataAccessSettings.connectionString))
            using (SqlCommand command = new SqlCommand(query, connection))
            {
                command.Parameters.AddWithValue("@UserName", newUserDTO.UserName);
                command.Parameters.AddWithValue("@Role", newUserDTO.Role);
                command.Parameters.AddWithValue("@BirthDate", newUserDTO.BirthDate);
                command.Parameters.AddWithValue("@ProfilePicture", string.IsNullOrEmpty(newUserDTO.ProfilePicture) ?
                 (object)DBNull.Value : newUserDTO.ProfilePicture);
                command.Parameters.AddWithValue("@UserID", UserID);
                command.Parameters.AddWithValue("@CountryID", newUserDTO.CountryID);
                command.Parameters.AddWithValue("@UpdatedAt", DateTime.UtcNow);
                // command.Parameters.AddWithValue("@Password", string.IsNullOrEmpty(newUserDTO.Password) ? (object)DBNull.Value : newUserDTO.Password);

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