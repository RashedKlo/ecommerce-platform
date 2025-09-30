using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace DataAccess.DTOS.ScreenMain.Boxes
{
    public class AddBoxesDTO
    {
        [Range(0, int.MaxValue, ErrorMessage = "Invalid  ID.")]

        public int ID { get; set; }
        [Required(ErrorMessage = "Title is required.")]
        public required string Title { get; set; }
        [Required(ErrorMessage = "Image is required.")]
        [Url(ErrorMessage = "Invalid Picture URL")]

        public required string Image { get; set; }
        [Range(0, double.MaxValue, ErrorMessage = "Invalid Price.")]

        public required decimal Price { get; set; }
        [Range(0, double.MaxValue, ErrorMessage = "Invalid Discount.")]

        public required decimal Discount { get; set; }
        [Required(ErrorMessage = "Title is required.")]

        public required string BannerName { get; set; }

    }

}