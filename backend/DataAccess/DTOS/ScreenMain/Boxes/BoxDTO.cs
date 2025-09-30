using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DataAccess.DTOS.ScreenMain.Boxes
{
    public class BoxDTO
    {
        public int ID { get; set; }
        public string Title { get; set; }
        public string Image { get; set; }
        public decimal Price { get; set; }
        public decimal Discount { get; set; }
        public BoxDTO(int ID, string Title, string Image, decimal Price, decimal Discount)
        {
            this.ID = ID;
            this.Title = Title;
            this.Image = Image;
            this.Price = Price;
            this.Discount = Discount;
        }
        public BoxDTO()
        {
            this.ID = -1;
            this.Title = this.Image = string.Empty;
            this.Price = this.Discount = 0;
        }
    }

}