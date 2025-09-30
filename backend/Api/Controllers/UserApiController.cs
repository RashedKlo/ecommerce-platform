
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Api.models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using DataAccess;
using BussinessAccess;
using System.Threading.Tasks;
using System.Text;
using DataAccess.DTOS.Country;
using DataAccess.DTOS.User;
namespace Api.Controllers
{
    [ApiController]
    [Route("Api/Users")]

    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]

    public class UserApiController(JwtOptions jwtOptions) : ControllerBase
    {
        [HttpGet("All", Name = "GetAllUsers")]
        // [Authorize(Roles = "Admin")] 
        [Authorize(Policy = "Admins")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<ActionResult<List<UserDTO>>> GetAllUsers(int pageNumber, int limitOfUsers)
        {
            IEnumerable<UserDTO> Users = await BussinessAccess.User.GetUsersAsync(pageNumber, limitOfUsers);
            if (Users.Count() == 0)
                return NotFound("Users not Found");
            else
                return Ok(new { data = Users.ToList() });
        }


        [HttpGet("Export", Name = "ExportCustomers")]
        [Authorize(Policy = "Admins")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> ExportCustomers(int pageNumber, int limitOfUsers)
        {
            IEnumerable<UserDTO> customers = await BussinessAccess.User.GetUsersAsync(pageNumber, limitOfUsers);
            if (customers.Count() == 0)
                return NotFound("customers not Found");

            var csvData = ConvertToCsv(customers.ToList());

            // Ensure UTF-8 encoding (with BOM to handle special characters)
            var bytes = Encoding.UTF8.GetBytes("\uFEFF" + csvData);
            var fileStream = new MemoryStream(bytes);

            return File(fileStream, "text/csv", "customers.csv");
        }

        private string ConvertToCsv(List<UserDTO> customers)
        {
            var sb = new StringBuilder();
            // Use semicolon as separator
            string separator = ";";

            // CSV Header with semicolon delimiter
            sb.AppendLine($"\"UserID\"{separator}\"Name\"{separator}\"Email\"{separator}\"Country\"{separator}\"CreatedAt\"");

            foreach (var customer in customers)
            {
                // If the Country property is an object, you might need to extract a specific value (e.g., customer.Country.Name)
                sb.AppendLine(
                    $"\"{customer.UserID}\"{separator}" +
                    $"\"{customer.UserName}\"{separator}" +
                    $"\"{customer.Email}\"{separator}" +
                    $"\"{customer.Country.Country}\"{separator}" +
                    $"\"{customer.CreatedAt.ToShortDateString()}\""
                );
            }

            return sb.ToString();
        }





        [HttpGet("Filter", Name = "FilterUsers")]
        // [Authorize(Roles = "Admin")] 
        [Authorize(Policy = "Admins")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<ActionResult<List<UserDTO>>> FilterUsers(string filterType, string value, int pageNumber, int limitOfUsers)
        {
            IEnumerable<UserDTO> Users = await BussinessAccess.User.FilterAsync(filterType, value, pageNumber, limitOfUsers);
            if (Users.Count() == 0)
                return NotFound("Users not Found");
            else
                return Ok(new { data = Users.ToList() });
        }







        [HttpGet("AllCountries", Name = "GetAllCountries")]
        // [Authorize(Roles = "Admin")] 
        [AllowAnonymous]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<ActionResult<List<CountryDTO>>> GetAllCountries()
        {
            IEnumerable<CountryDTO> countries = await Country.GetCountries();
            if (countries.Count() == 0)
                return NotFound("countries not Found");
            else
                return Ok(countries.ToList());
        }




        [HttpDelete("Delete/{UserID}", Name = "DeleteUser")]
        [Authorize(Policy = "Admins")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<ActionResult> DeleteUser(int UserID)
        {
            try
            {
                if (await BussinessAccess.User.DeleteUserAsync(UserID))
                    return Ok("User is Deleted");
                else
                    return NotFound($"User with ID : {UserID} does not deleted");
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }




        // [Authorize(Policy = "AgeGreaterThan25")]
        [HttpGet("Get/{UserID}", Name = "GetUserByID")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [Authorize(Policy = "Admins")]
        public async Task<ActionResult<UserDTO?>> GetUserByID(int UserID)
        {
            try
            {
                var user = await BussinessAccess.User.FindUserByIDAsync(UserID);
                return user.UserDTO;
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }

        }







        // [Authorize(Policy = "Admins")]
        [HttpPut("Update/{UserID}", Name = "UpdateUser")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
       // [Authorize(Policy = "Admins")]
        public async Task<ActionResult> UpdateUserAsync(int UserID, UpdateDTO userDTO)
        {
            try
            {
                var user = await BussinessAccess.User.FindUserByIDAsync(UserID);
                if (user == null)
                {
                    return NotFound($"User with ID: {UserID} not found.");
                }
                if (user.UserName != userDTO.UserName && await BussinessAccess.User.IsUserNameExist(userDTO.UserName))
                {
                    return Conflict("User Name has been taken");
                }
                user.UserName = userDTO.UserName;
                user.CountryID = userDTO.CountryID;
                user.ProfilePicture = userDTO.ProfilePicture;
                user.BirthDate = userDTO.BirthDate;
                user.Role = userDTO.Role;
                if (await user.SaveAsync())
                    return Ok(new { User = user.UserDTO });
                else
                    return StatusCode(500, new { message = "Error Updating User" });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }



        [HttpPost("Add", Name = "AddUser")]
        [Authorize(Policy = "Admins")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult> AddUser(RegisterDTO userDTO)
        {
            try
            {
                User user = new(userDTO, BussinessAccess.User.EnMode.Add);
                if (await user.SaveAsync())
                {
                    return Created("Added Successfuly", new { user = user.UserDTO });
                }
                else
                {
                    return StatusCode(500, "Error Adding User");
                }
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }

        }





        [HttpPost("Register", Name = "Register")]
        [AllowAnonymous]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult> Register(RegisterDTO userDTO)
        {
            try
            {
                User user = new(userDTO, BussinessAccess.User.EnMode.Add);
                if (await user.SaveAsync())
                {
                    var tokenString = AuthService.GenerateJwtToken(user.UserDTO, jwtOptions);
                    var RefreshToken = await AuthService.GenerateRefreshToken(user.UserID);
                    return Created("", new
                    {
                        token = tokenString,
                        refreshToken = RefreshToken,
                        user = user.UserDTO
                    });
                }
                else
                {
                    return StatusCode(500, "Error Adding User");
                }
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }

        }

        [HttpPost("Login", Name = "Login")]
        [AllowAnonymous]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<string>> Login(LoginDTO userDTO)
        {
            try
            {
                var user = await BussinessAccess.User.FindUserByEmailAndPasswordAsync(userDTO.Email, userDTO.Password);
                if (user == null)
                {
                    return Unauthorized($"User not Found");
                }
                else
                {
                    var tokenString = AuthService.GenerateJwtToken(user.UserDTO, jwtOptions);
                    var RefreshToken = await AuthService.GenerateRefreshToken(user.UserID);
                    return Ok(new { token = tokenString, refreshToken = RefreshToken, user = user.UserDTO });
                }
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }













        [HttpPost("RefreshToken")]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        // [Authorize(Policy = "Admins")]
        public async Task<ActionResult> RefreshToken(RequestRefreshToken Token)
        {
            string TokenString = "User not found";
            var Obtoken = await BussinessAccess.RefreshToken.FindRefershTokenByTokenAsync(Token.RefreshToken);
            if (Obtoken == null || !Obtoken.IsActive)
            {
                return Unauthorized("Invalid Refresh Token");
            }
            var user = await BussinessAccess.User.FindUserByIDAsync(Obtoken.UserID);
            if (user != null)
            {
                TokenString = AuthService.GenerateJwtToken(user.UserDTO, jwtOptions);
            }
            return Ok(new { token = TokenString, refreshToken = Obtoken.Token });

        }



        [HttpPost("Logout")]
        [Authorize(Policy = "Admins")]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult> RevokeToken(RequestRefreshToken Token)
        {
            var Obtoken = await BussinessAccess.RefreshToken.FindRefershTokenByTokenAsync(Token.RefreshToken);
            if (Obtoken == null || !Obtoken.IsActive)
            {
                return NotFound("Token not found or already revoked");
            }
            if (await BussinessAccess.RefreshToken.RevokeRefershToken(Obtoken.UserID))
                return Ok("Token Revoked");
            else
                return StatusCode(500, "Erro Token not Revoked");

        }








        [HttpPost("CurrentUser", Name = "GetCurrentUser")]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<UserDTO>> GetCurrentUser(RequestRefreshToken RefreshToken)
        {
            if (RefreshToken.RefreshToken == "")
            {
                return BadRequest("Invalid Token");
            }
            var CurrentUser = await BussinessAccess.RefreshToken.FindUserByTokenAsync(RefreshToken.RefreshToken);
            if (CurrentUser == null)
            {
                return Unauthorized("Token Not Found");
            }
            return CurrentUser;
        }





    }
}