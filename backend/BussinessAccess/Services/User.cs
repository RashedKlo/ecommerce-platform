using System.Collections.Immutable;
using System.Net;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using DataAccess;
using System.Text.RegularExpressions;
using System.Net.Mail;
using DataAccess.DTOS.Country;
using DataAccess.DTOS.User;
using DataAccess.Repositories.User;
using Azure;
using DataAccess.Services;
using DataAccess.Filters;
namespace BussinessAccess
{
    public class User
    {
        public enum EnMode { Add = 1, Update = 2 }
        public EnMode Mode = EnMode.Add;
        public int UserID { get; set; }
        public int CountryID { get; set; }
        public string UserName { get; set; }
        public string Role { get; set; }
        public string Email { get; set; }
        public DateTime BirthDate { get; set; }
        public CountryDTO Country { get; set; }
        public string ProfilePicture { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        public UserDTO UserDTO
        {
            get
            {
                return new UserDTO(UserID, UserName, Role, Email, BirthDate, Country, ProfilePicture, CreatedAt, UpdatedAt);
            }
        }
        public RegisterDTO RegisterDTO
        {
            get
            {
                return new RegisterDTO
                {
                    UserName = UserName,
                    Email = Email,
                    Role = Role,
                    Password = Password,
                    ProfilePicture = ProfilePicture,
                    BirthDate = BirthDate,
                    CountryID = CountryID
                };
            }
        }
        public UpdateDTO UpdateUserDTO
        {
            get
            {
                return new UpdateDTO
                {
                    UserName = UserName,
                    Role = Role,
                    ProfilePicture = ProfilePicture,
                    BirthDate = BirthDate,
                    CountryID = CountryID
                };
            }
        }

        public User(UserDTO user, EnMode mode)
        {

            Mode = mode;
            UserID = user.UserID;
            CountryID = user.Country.CountryID;
            Password = string.Empty;
            UserName = user.UserName;
            Email = user.Email;
            Role = user.Role;
            BirthDate = user.BirthDate;
            Country = user.Country;
            ProfilePicture = user.ProfilePicture;
            CreatedAt = user.CreatedAt;
            UpdatedAt = user.UpdatedAt;
        }


        public User(RegisterDTO user, EnMode mode = EnMode.Add)
        {


            Mode = mode;
            UserID = -1;
            Password = user.Password;
            UserName = user.UserName;
            CountryID = user.CountryID;
            Email = user.Email;
            Role = user.Role;
            BirthDate = user.BirthDate;
            ProfilePicture = user.ProfilePicture;
            CreatedAt = DateTime.Now;
            UpdatedAt = DateTime.Now;
            Country = new(CountryID, string.Empty);
        }

        public User()
        {

            UserID = -1;
            Country = new CountryDTO();
            UserName = Email = ProfilePicture = Role = string.Empty;
            CreatedAt = UpdatedAt = BirthDate = DateTime.MaxValue;
        }
        public static async Task<User> FindUserByIDAsync(int UserID)
        {
            if (UserID <= 0)
            {
                throw new InvalidOperationException("UserID not valid");
            }
            UserDTO userDTO = await UserRepository.GetUserByIdAsync(UserID);
            if (userDTO.UserID == -1)
            {
                throw new InvalidOperationException("User not found");
            }
            else
                return new User(userDTO, EnMode.Update);
        }
        public static async Task<User?> FindUserByEmailAsync(string Email)
        {
            if (string.IsNullOrEmpty(Email) || !Validation.IsEmailValid(Email))
            {
                throw new InvalidOperationException("Email not valid");
            }
            UserDTO userDTO = await UserRepository.GetUserByEmailAsync(Email);
            if (userDTO.UserID == -1)
            {
                throw new InvalidOperationException("User not found");
            }
            else
                return new User(userDTO, EnMode.Update);
        }
        public static async Task<User?> FindUserByEmailAndPasswordAsync(string Email, string Password)
        {
            if (string.IsNullOrEmpty(Email) || !Validation.IsEmailValid(Email))
            {
                throw new InvalidOperationException("Email not valid");
            }
            if (string.IsNullOrEmpty(Password) || !Validation.IsPasswordValid(Password))
            {
                throw new InvalidOperationException("Password not valid");
            }
            UserDTO userDTO = await UserRepository.GetUserByEmailAndPasswordAsync(Email, Password);
            if (userDTO.UserID == -1)
            {
                throw new InvalidOperationException("User not found");
            }
            else
                return new User(userDTO, EnMode.Update);
        }
        private async Task<bool> _AddUserAsync()
        {
            // checkemail and check country and checkDate and check user name is unique
            if (!Validation.IsBirthDateValid(BirthDate))
            {
                throw new InvalidOperationException("Invalid birth date.");
            }
            if (await IsEmailUserExistedAsyn(Email))
            {
                throw new InvalidOperationException("Email has been taken");
            }
            if (await IsUserNameExist(UserName))
            {
                throw new InvalidOperationException("User Name has been taken");
            }
            this.UserID = await UserRepository.AddUserAsync(RegisterDTO);
            return this.UserID != -1;
        }
        private async Task<bool> _UpdateUserAsync()
        {
            if (!Validation.IsBirthDateValid(BirthDate))
            {
                throw new InvalidOperationException("Invalid birth date.");
            }
            return await UserRepository.UpdateUserAsync(UpdateUserDTO, UserID);
        }
        public async Task<bool> SaveAsync()
        {
            switch (Mode)
            {
                case EnMode.Add:
                    if (await _AddUserAsync())
                    {
                        Mode = EnMode.Update;
                        return true;
                    }
                    return false;
                case EnMode.Update:
                    return await _UpdateUserAsync();
                default:
                    return false;
            }
        }
        public static async Task<bool> IsEmailUserExistedAsyn(string Email)
        {
            if (string.IsNullOrEmpty(Email) || !Validation.IsEmailValid(Email))
            {
                throw new InvalidOperationException("Email not valid");
            }
            return await UserRepository.IsEmailUserExisted(Email);
        }
        public static async Task<bool> IsUserNameExist(string UserName)
        {
            if (string.IsNullOrEmpty(UserName) || UserName.Length <= 4)
            {
                throw new InvalidOperationException("UserName not Valid");
            }
            return await UserRepository.IsUserNameExisted(UserName);
        }
        public static async Task<bool> DeleteUserAsync(int UserID)
        {
            if (UserID < 1)
            {
                throw new InvalidOperationException("UserID not Valid");
            }
            return await UserRepository.DeleteUserAsync(UserID);
        }
        public static async Task<IEnumerable<UserDTO>> GetUsersAsync(int pageNumber, int limitOfUsers)
        {
            if (pageNumber < 0)
            {
                pageNumber = 1;
            }
            if (limitOfUsers < 0)
            {
                pageNumber = 1;
            }
            return await UserRepository.GetAllUsersAsync(new PageFilter(pageNumber, limitOfUsers));
        }


        public static async Task<IEnumerable<UserDTO>> FilterAsync(string filterType, string value, int pageNumber, int limitOfUsers)
        {
            if (pageNumber < 0)
            {
                pageNumber = 1;
            }
            if (limitOfUsers < 0)
            {
                pageNumber = 1;
            }
            if (string.IsNullOrEmpty(filterType))
            {
                throw new InvalidOperationException($"{filterType} not Valid");
            }
            if (string.IsNullOrEmpty(value))
            {
                throw new InvalidOperationException($"Text Search not Valid");
            }
            return await UserRepository.GetUsersByFilter(filterType.ToLower().Trim() == "email" ? FilterType.User.Email : FilterType.User.UserName, new ValueFilter { value = value, page = new PageFilter(pageNumber, limitOfUsers) });
        }




    }
}