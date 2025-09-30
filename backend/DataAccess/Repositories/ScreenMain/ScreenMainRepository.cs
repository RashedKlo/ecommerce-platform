using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DataAccess.DTOS.ScreenMain.Banner;
using DataAccess.Repositories.ScreenMain.Banner.Commands;
using DataAccess.Repositories.ScreenMain.Banner.Queries;

namespace DataAccess.Repositories.ScreenMain
{
    public class ScreenMainRepository
    {
        public static async Task<bool> UpdateBanner(AddDTO banner, string BannerName)
        {
            return await UpdateBannerCommand.ExcuteAsync(banner, BannerName);
        }
        public static async Task<BannerDTO> GetBannerByName(string BannerName)
        {
            return await GetBannerByNameQuery.ExcuteAsync(BannerName);
        }
    }
}