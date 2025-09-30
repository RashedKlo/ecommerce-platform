
using Api.models;
using Microsoft.AspNetCore.Mvc;

using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authentication.Cookies;
using System.Security.Claims;
using Microsoft.AspNetCore.Cors;
using Google.Apis.Auth;
using Microsoft.AspNetCore.Authorization;
using BussinessAccess;
using DataAccess;
using Newtonsoft.Json;
using DataAccess.DTOS.User;
using DataAccess.Repositories.User;

namespace Api.Controllers
{
    [ApiController]
    [Route("api/Auth")]
    [Authorize(AuthenticationSchemes = GoogleDefaults.AuthenticationScheme)]

    public class AuthController(JwtOptions jwtOptions) : ControllerBase
    {



        [HttpGet("login-google", Name = "LoginGoogle")]
        [AllowAnonymous]
        public IActionResult LoginGoogle()
        {
            var properties = new AuthenticationProperties { RedirectUri = Url.Action("GoogleResponse") };
            return Challenge(properties, GoogleDefaults.AuthenticationScheme);
        }
        [HttpGet("response-google", Name = "GoogleResponse")]
        [AllowAnonymous]

        public async Task<IActionResult> GoogleResponse()
        {
            var newID = -1;
            var result = await HttpContext.AuthenticateAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            if (!result.Succeeded)
            {
                return BadRequest("Authentication failed.");
            }
            var accessToken = await HttpContext.GetTokenAsync(CookieAuthenticationDefaults.AuthenticationScheme, "access_token");
            var claims = result.Principal.Identities.FirstOrDefault()?.Claims;
            var username = claims?.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;
            var email = claims?.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
            var googleId = claims?.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            var UserData = claims?.FirstOrDefault(c => c.Type == ClaimTypes.UserData)?.Value;
            if (username == null || email == null || googleId == null || accessToken == null)
            {
                return BadRequest(" not found.");
            }

            var tokenString = "";
            var refreshToken = "";
            var user = await UserRepository.GetUserByEmailAsync(email.ToString());
            if (user.UserID != -1)
            {
                object obuser = new
                {
                    userID = user.UserID,
                    userName = user.UserName,
                    email = user.Email,
                    birthDate = user.BirthDate,
                    country = new
                    {
                        countryID = user.Country.CountryID,
                        country = user.Country.Country,
                    },
                    profilePicture = user.ProfilePicture,
                    createdAt = user.CreatedAt,
                    updatedAt = user.UpdatedAt,
                };
                var userJson = JsonConvert.SerializeObject(obuser);

                tokenString = AuthService.GenerateJwtToken(user, jwtOptions);
                refreshToken = await AuthService.GenerateRefreshToken(user.UserID);
                Response.Cookies.Append("token", tokenString, new CookieOptions
                {
                    HttpOnly = false,
                    Secure = true,
                    SameSite = SameSiteMode.Strict,
                    Expires = DateTimeOffset.Now.AddDays(30)
                });
                Response.Cookies.Append("reftoken", refreshToken, new CookieOptions
                {
                    HttpOnly = false,
                    Secure = true,
                    SameSite = SameSiteMode.Strict,
                    Expires = DateTimeOffset.Now.AddDays(30)
                });
                Response.Cookies.Append("currentUser", userJson, new CookieOptions
                {
                    HttpOnly = false,
                    Secure = true,
                    SameSite = SameSiteMode.Strict,
                    Expires = DateTimeOffset.Now.AddDays(30)
                });
                return Redirect($"http://localhost:5173/");
            }
            else
            {

                User newUser = new(
                    new RegisterDTO
                    {
                        UserName = username,
                        Email = email,
                        CountryID = 1,
                        BirthDate = DateTime.UtcNow.AddYears(-10),
                        ProfilePicture = "",
                        Password = "",
                        Role = "",
                    }
                    , BussinessAccess.User.EnMode.Add);
                if (await newUser.SaveAsync())
                {
                    newID = newUser.UserID;
                    tokenString = AuthService.GenerateJwtToken(newUser.UserDTO, jwtOptions);
                    refreshToken = await AuthService.GenerateRefreshToken(newUser.UserID);
                    Response.Cookies.Append("token", tokenString, new CookieOptions
                    {
                        HttpOnly = false,
                        Secure = true,
                        SameSite = SameSiteMode.Strict,
                        Expires = DateTimeOffset.Now.AddDays(30)
                    });
                    Response.Cookies.Append("reftoken", refreshToken, new CookieOptions
                    {
                        HttpOnly = false,
                        Secure = true,
                        SameSite = SameSiteMode.Strict,
                        Expires = DateTimeOffset.Now.AddDays(30)
                    });
                    return Redirect($"http://localhost:5173/googlelogin/{newID}");
                }
                else
                    return StatusCode(500, "internal server code");

            }

        }
    }
}
