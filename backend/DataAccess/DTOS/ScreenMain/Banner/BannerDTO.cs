using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DataAccess.DTOS.ScreenMain.Boxes;

namespace DataAccess.DTOS.ScreenMain.Banner
{
    public class BannerDTO
    {
        public string BannerName { get; set; }
        public string Image { get; set; }
        public string Link { get; set; }
        public string Title { get; set; }
        public string Subtitle { get; set; }
        public string BtnText { get; set; }
        public List<BoxDTO> BlendedBoxes { get; set; }
        public BannerDTO(string BannerName, string Image, string Link, string Title, string Subtitle, string BtnText, List<BoxDTO> blendedBoxes)
        {
            this.BannerName = BannerName;
            this.Image = Image;
            this.Link = Link;
            this.Title = Title;
            this.Subtitle = Subtitle;
            this.BtnText = BtnText;
            this.BlendedBoxes = blendedBoxes;
        }
        public BannerDTO()
        {
            this.BannerName = this.Image = this.Link = this.Title = this.Subtitle = this.BtnText = string.Empty;
            this.BlendedBoxes = [];
        }

    }

}