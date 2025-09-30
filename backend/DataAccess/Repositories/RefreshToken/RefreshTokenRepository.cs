using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DataAccess.DTOS.RefreshToken;
using DataAccess.DTOS.User;

using DataAccess.Repositories.RefreshToken.Commands;
using DataAccess.Repositories.RefreshToken.Queries;

namespace DataAccess.Repositories.RefreshToken
{
    public class RefreshTokenRepository
    {
        public static async Task<int> AddRefreshTokenAsync(RefreshTokenDTO tokenDTO)
        {
            return await AddRefreshTokenCommand.ExcuteAsync(tokenDTO);
        }
        public static async Task<bool> RevokeRefreshTokenAsync(int UserID)
        {
            return await RevokeRefreshTokenCommand.ExcuteAsync(UserID);
        }
        public static async Task<bool> UpdateRefreshTokenAsync(RefreshTokenDTO tokenDTO)
        {
            return await UpdateRefreshTokenCommand.ExcuteAsync(tokenDTO);
        }
        public static async Task<List<RefreshTokenDTO>> GetAllRefreshTokensAsync()
        {
            return await GetAllRefreshTokensQuery.ExcuteAsync();
        }
        public static async Task<RefreshTokenDTO> GetRefreshTokenByIDAsync(int ID)
        {
            return await GetRefreshTokenByIDQuery.ExcuteAsync(ID);
        }
        public static async Task<RefreshTokenDTO> GetRefreshTokenByTokenAsyn(string Token)
        {
            return await GetRefreshTokenByTokenQuery.ExcuteAsync(Token);
        }
        public static async Task<UserDTO> GetUserByTokenAsync(string Token)
        {
            return await GetUserByTokenQuery.ExcuteAsync(Token);
        }
    }
}