using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using DataAccess.DTOS.ScreenMain.Boxes;

namespace DataAccess.DTOS.ScreenMain.Banner
{
    public class AddDTO
    {
        [Required(ErrorMessage = "Title is required.")]
        public required string BannerName { get; set; }

        [Required(ErrorMessage = "Link is required.")]

        public required string Link { get; set; }

        [Required(ErrorMessage = "Image is required.")]
        [Url(ErrorMessage = "Invalid Picture URL")]
        public string Image { get; set; } = string.Empty;

        public string Title { get; set; } = string.Empty;
        public string Subtitle { get; set; } = string.Empty;
        public string BtnText { get; set; } = string.Empty;
        public List<AddBoxesDTO> BlendedBoxes { get; set; } = [];

    }

}