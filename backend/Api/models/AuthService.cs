using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Microsoft.IdentityModel.Tokens;
using DataAccess;
using BussinessAccess;
using DataAccess.DTOS;
using DataAccess.DTOS.User;
namespace Api.models
{
    public class AuthService
    {

        async public static Task<string> GenerateRefreshToken(int UserID)
        {
            string Token = Convert.ToBase64String(RandomNumberGenerator.GetBytes(32));
            // revoke all active refresh token
            await RefreshToken.RevokeRefershToken(UserID);
            //generate refresh token
            RefreshToken refreshToken = new(new DataAccess.DTOS.RefreshToken.RefreshTokenDTO(0, UserID, Token, DateTime.UtcNow, DateTime.UtcNow.AddDays(30),
             false));
            await refreshToken.SaveAsync();
            return Token;

        }
        public static string GenerateJwtToken(UserDTO user, JwtOptions jwtOptions)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtOptions.SigningKey));
            var signinCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Issuer = jwtOptions.Issuer,
                Audience = jwtOptions.Audience,
                SigningCredentials = signinCredentials,
                Expires = DateTime.UtcNow.Add(jwtOptions.Lifetime),
                Subject = new ClaimsIdentity(new Claim[]
                {
                         new(ClaimTypes.NameIdentifier,user.UserID.ToString ()),
                        new(ClaimTypes.Email, user.Email),
                        new(ClaimTypes.Role, user.Role),
                        // new("DateOfBirth",DateTime.Now.ToString ()),
            })
            };
            var securityToken = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(securityToken);
            return tokenString;
        }
    }
    public class RequestRefreshToken
    {
        public required string RefreshToken { get; set; }
    }
}