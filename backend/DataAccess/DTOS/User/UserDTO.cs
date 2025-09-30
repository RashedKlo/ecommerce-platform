using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DataAccess.DTOS.Country;

namespace DataAccess.DTOS.User
{
    public class UserDTO
    {
        public int UserID { get; set; }
        public string UserName { get; set; }
        public string Role { get; set; }
        public string Email { get; set; }
        public DateTime BirthDate { get; set; }
        public CountryDTO Country { get; set; }
        public string ProfilePicture { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        public UserDTO(int userID, string userName, string role, string email, DateTime birthDate,
            CountryDTO country, string profilePicture, DateTime createdAt, DateTime updatedAt)
        {
            UserID = userID;
            UserName = userName;
            Email = email;
            Role = role;
            BirthDate = birthDate;
            Country = country;
            ProfilePicture = profilePicture;
            CreatedAt = createdAt;
            UpdatedAt = updatedAt;
        }

        public UserDTO()
        {
            UserID = -1;

            Country = new CountryDTO();
            Role = UserName = Email = ProfilePicture = string.Empty;
            CreatedAt = UpdatedAt = BirthDate = DateTime.MaxValue;
        }
    }

}