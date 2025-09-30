using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata.Ecma335;
using System.Threading.Tasks;
using DataAccess;
using DataAccess.DTOS.ScreenMain.Banner;
using DataAccess.DTOS.ScreenMain.Boxes;
using DataAccess.Repositories.ScreenMain;

namespace BussinessAccess
{
    public class Banner
    {
        public string BannerName { get; set; }
        public string Image { get; set; }
        public string Link { get; set; }
        public string Title { get; set; }
        public string Subtitle { get; set; }
        public string BtnText { get; set; }
        public List<BoxDTO> BlendedBoxes { get; set; }
        public Banner(BannerDTO bannerDTO)
        {
            this.BannerName = bannerDTO.BannerName;
            this.Image = bannerDTO.Image;
            this.Link = bannerDTO.Link;
            this.Title = bannerDTO.Title;
            this.Subtitle = bannerDTO.Subtitle;
            this.BtnText = bannerDTO.BtnText;
            this.BlendedBoxes = bannerDTO.BlendedBoxes;
        }
        public Banner()
        {
            this.BannerName = this.Image = this.Link = this.Title = this.Subtitle = this.BtnText = string.Empty;
            this.BlendedBoxes = [];
        }
        public BannerDTO BannerDTO
        {
            get
            {
                return new BannerDTO(BannerName, Image, Link, Title, Subtitle, BtnText, BlendedBoxes);
            }
        }
        public static async Task<Banner> GetBanner(string BannerName)
        {
            if (string.IsNullOrEmpty(BannerName))
            {
                throw new InvalidOperationException("BannerName not valid");
            }
            BannerDTO banner = await ScreenMainRepository.GetBannerByName(BannerName);
            if (string.IsNullOrEmpty(banner.BannerName))
            {
                throw new InvalidOperationException("Banner not found");
            }
            else
                return new Banner(banner);
        }
        public static async Task<bool> HandleBanner(AddDTO addBannerDTO, string BannerName)
        {
            if (string.IsNullOrEmpty(BannerName))
            {
                throw new InvalidOperationException("BannerName not valid");
            }

            BannerDTO banner = await ScreenMainRepository.GetBannerByName(BannerName);
            if (string.IsNullOrEmpty(banner.BannerName))
            {
                throw new InvalidOperationException("Banner not found");
            }
            else
            {
                return await ScreenMainRepository.UpdateBanner(addBannerDTO, BannerName);

            }
        }


    }
}