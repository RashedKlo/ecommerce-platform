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
using DataAccess.DTOS.RefreshToken;
using DataAccess.Repositories.RefreshToken;
using DataAccess.DTOS.User;
namespace BussinessAccess
{
    public class RefreshToken
    {
        public enum EnMode { Add = 1, Update = 2 }
        public static EnMode Mode = EnMode.Add;
        public int ID { get; set; }
        public int UserID { get; set; }
        public string Token { get; set; } = string.Empty;
        public DateTime TokenCreated { get; set; }
        public DateTime Expires { get; set; }
        public bool IsRevoked { get; set; }
        public bool IsExpired => DateTime.UtcNow >= Expires;
        public bool IsActive => !IsExpired && !IsRevoked;

        public RefreshTokenDTO tokenDTO
        {
            get
            {
                return new RefreshTokenDTO(ID, UserID, Token, TokenCreated, Expires, IsRevoked);

            }
        }
        public RefreshToken(RefreshTokenDTO refreshTokenDTO, EnMode mode = EnMode.Add)
        {
            this.ID = refreshTokenDTO.ID;
            this.UserID = refreshTokenDTO.UserID;
            this.Token = refreshTokenDTO.Token;
            this.Expires = refreshTokenDTO.Expires;
            this.IsRevoked = refreshTokenDTO.IsRevoked;
            this.TokenCreated = refreshTokenDTO.TokenCreated;
            Mode = mode;
        }
        public static async Task<RefreshToken> FindRefershTokenByIDAsync(int TokenID)
        {
            if (TokenID <= 0)
            {
                throw new InvalidOperationException("TokenID not valid");
            }
            RefreshTokenDTO tokenDTO = await RefreshTokenRepository.GetRefreshTokenByIDAsync(TokenID);
            if (tokenDTO.ID == -1)
            {
                throw new InvalidOperationException("Token not found");
            }
            else
                return new RefreshToken(tokenDTO, EnMode.Update);
        }
        public static async Task<RefreshToken> FindRefershTokenByTokenAsync(string Token)
        {
            if (string.IsNullOrEmpty(Token))
            {
                throw new InvalidOperationException("Token not valid");
            }
            RefreshTokenDTO tokenDTO = await RefreshTokenRepository.GetRefreshTokenByTokenAsyn(Token);
            if (tokenDTO.ID == -1)
            {
                throw new InvalidOperationException("Token not found");
            }
            else
                return new RefreshToken(tokenDTO, EnMode.Update);
        }
        private async Task<bool> _AddRefreshTokenAsync()
        {

            this.ID = await RefreshTokenRepository.AddRefreshTokenAsync(tokenDTO);
            return this.UserID != -1;
        }
        private async Task<bool> _UpdateRefreshTokenAsync()
        {
            return await RefreshTokenRepository.UpdateRefreshTokenAsync(tokenDTO);
        }
        public async Task<bool> SaveAsync()
        {
            switch (Mode)
            {
                case EnMode.Add:
                    if (await _AddRefreshTokenAsync())
                    {
                        Mode = EnMode.Update;
                        return true;
                    }
                    return false;
                case EnMode.Update:
                    return await _UpdateRefreshTokenAsync();
                default:
                    return false;
            }
        }

        public static async Task<bool> RevokeRefershToken(int UserID)
        {
            if (UserID < 1)
            {
                throw new InvalidOperationException("UserID not Valid");
            }
            return await RefreshTokenRepository.RevokeRefreshTokenAsync(UserID);
        }

        public static async Task<UserDTO> FindUserByTokenAsync(string Token)
        {
            if (string.IsNullOrEmpty(Token))
            {
                throw new InvalidOperationException("Token not valid");
            }
            UserDTO user = await RefreshTokenRepository.GetUserByTokenAsync(Token);
            if (user.UserID == -1)
            {
                throw new InvalidOperationException("Token not found");
            }
            else
                return user;
        }




    }
}