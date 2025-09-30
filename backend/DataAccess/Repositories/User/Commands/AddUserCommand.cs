using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;
using DataAccess.DTOS.User;
using System.Text;
using System.Security.Cryptography;
namespace DataAccess.Repositories.User.Commands
{
    public class AddUserCommand
    {
        public static async Task<int> ExcuteAsync(RegisterDTO userDTO)
        {

            int personID = -1;
            string query = @" 
            INSERT INTO Users (Email, UserName,Role, Password,BirthDate,CountryID, ProfilePicture,CreatedAt,UpdatedAt) 
                     VALUES (@Email, @UserName,@Role, @Password,@BirthDate,@CountryID, @ProfilePicture,@CreatedAt,@UpdatedAt); 
                     SELECT SCOPE_IDENTITY();";
            using (SqlConnection connection = new SqlConnection(clsDataAccessSettings.connectionString))
            using (SqlCommand command = new SqlCommand(query, connection))
            {
                command.Parameters.AddWithValue("@UserName", userDTO.UserName);
                command.Parameters.AddWithValue("@Role", userDTO.Role);
                command.Parameters.AddWithValue("@Email", userDTO.Email);
                command.Parameters.AddWithValue("@CountryID", userDTO.CountryID);
                command.Parameters.AddWithValue("@BirthDate", userDTO.BirthDate);
                command.Parameters.AddWithValue("@ProfilePicture", string.IsNullOrEmpty(userDTO.ProfilePicture) ?
                (object)DBNull.Value : userDTO.ProfilePicture);
                command.Parameters.AddWithValue("@CreatedAt", DateTime.UtcNow);
                command.Parameters.AddWithValue("@UpdatedAt", DateTime.UtcNow);
                command.Parameters.AddWithValue("@Password", string.IsNullOrEmpty(userDTO.Password) ? System.Data.SqlTypes.SqlBinary.Null :
SHA512.HashData(Encoding.UTF8.GetBytes(userDTO.Password)));

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