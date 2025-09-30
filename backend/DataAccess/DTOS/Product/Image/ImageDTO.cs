using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace DataAccess.DTOS.Product.Image
{
    public class ImageDTO
    {
       // [Url(ErrorMessage = "Invalid Picture URL")]
        public string Image { get; set; } = string.Empty;

    }
}