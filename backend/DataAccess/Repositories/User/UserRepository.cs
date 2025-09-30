using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DataAccess.DTOS.User;
using DataAccess.Filters;

using DataAccess.Repositories.User.Commands;
using DataAccess.Repositories.User.Queries;
using DataAccess.Services;

namespace DataAccess.Repositories.User
{

    public class UserRepository
    {
        public static async Task<int> AddUserAsync(RegisterDTO user)
        {
            return await AddUserCommand.ExcuteAsync(user);
        }
        public static async Task<UserDTO> LoginUserAsync(LoginDTO user)
        {
            return await GetUserByEmailAndPasswordQuery.ExcuteAsync(user.Email, user.Password);
        }
        public static async Task<IEnumerable<UserDTO>> GetAllUsersAsync(PageFilter page)
        {
            return await GetAllUsersQuery.ExcuteAsync(page);
        }
        public static async Task<UserDTO> GetUserByIdAsync(int id)
        {
            return await GetUserByIDQuery.ExcuteAsync(id);
        }
        public static async Task<UserDTO> GetUserByEmailAsync(string Email)
        {
            return await GetUserByEmailQuery.ExcuteAsync(Email);
        }
        public static async Task<IEnumerable<UserDTO>> GetUsersByFilter(FilterType.User user, ValueFilter filter)
        {
            return await GetUsersByFilterQuery.ExcuteAsync(user, filter);
        }
        public static async Task<UserDTO> GetUserByEmailAndPasswordAsync(string Email, string Password)
        {
            return await GetUserByEmailAndPasswordQuery.ExcuteAsync(Email, Password);
        }
        public static async Task<bool> UpdateUserAsync(UpdateDTO dto, int UserID)
        {
            return await UpdateUserCommand.ExcuteAsync(dto, UserID);
        }
        public static async Task<bool> DeleteUserAsync(int ID)
        {
            return await DeleteUserCommand.ExcuteAsync(ID);
        }

        public static async Task<bool> IsEmailUserExisted(string Email)
        {
            return await IsEmailUserExistedQuery.ExcuteAsync(Email);
        }
        public static async Task<bool> IsUserNameExisted(string UserName)
        {
            return await IsUserNameExistedQuery.ExcuteAsync(UserName);
        }
    }
}