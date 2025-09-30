using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DataAccess.DTOS.Product.Image;

namespace DataAccess.DTOS.Product
{
    public class ProductDTO
    {
        public int ProductID { get; set; }
        public int CategoryID { get; set; }

        public string ProductName { get; set; }

        public string Description { get; set; }

        public decimal Price { get; set; }

        public decimal Discount { get; set; }
        public double Rating { get; set; }
        public int QuantityInStock { get; set; }

        public DateTime CreatedAt { get; set; }
        public string Category { get; set; }
        public List<ImageDTO> ImagesDTO { get; set; } = [];
        public ProductDTO(int ProductID, int CategoryID, string ProductName, string Description,
         decimal Price, decimal Discount, double Rating, int QuantityInStock, DateTime CreatedAt, string category, List<ImageDTO> imageDTOs)
        {
            this.ProductID = ProductID;
            this.CategoryID = CategoryID;
            this.ProductName = ProductName;
            this.Description = Description;
            this.Price = Price;
            this.Rating = Rating;
            this.Discount = Discount;
            this.CreatedAt = CreatedAt;
            this.Category = category;
            this.ImagesDTO = imageDTOs;
            this.QuantityInStock = QuantityInStock;
        }
        public ProductDTO()
        {
            this.ProductID = this.CategoryID = -1;
            this.ProductName = this.Description = string.Empty;
            this.Price = this.Discount = this.QuantityInStock = 0;
            this.CreatedAt = DateTime.MaxValue;
            this.ImagesDTO = [];
            this.Category = string.Empty;
        }

    }

}