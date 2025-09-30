using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using DataAccess;
using DataAccess.DTOS;
using DataAccess.DTOS.Product;
using DataAccess.DTOS.Product.Image;
using DataAccess.Filters;
using DataAccess.Repositories.Product;
using Microsoft.Identity.Client;

namespace BussinessAccess
{
    public class Product
    {
        public enum EnMode { Add = 1, Update }
        public EnMode Mode = EnMode.Update;
        public int ProductID { get; set; }
        public int CategoryID { get; set; }

        public string ProductName { get; set; }

        public string Description { get; set; }

        public decimal Price { get; set; }

        public decimal Discount { get; set; }
        public double Rating { get; set; }
        public int QuantityInStock { get; set; }

        public DateTime CreatedAt { get; set; }
        public string Category { get; set; } = string.Empty;
        public List<ImageDTO> ImagesDTO { get; set; } = [];


        public Product(AddDTO productWithImagesDTO, EnMode mode = EnMode.Add)
        {
            this.ProductID = -1;
            this.CreatedAt = DateTime.UtcNow;
            this.CategoryID = productWithImagesDTO.CategoryID;
            this.ProductName = productWithImagesDTO.ProductName;
            this.Description = productWithImagesDTO.Description;
            this.Price = productWithImagesDTO.Price;
            this.Discount = productWithImagesDTO.Discount;
            this.Rating = productWithImagesDTO.Rating;
            this.QuantityInStock = productWithImagesDTO.QuantityInStock;
            this.ImagesDTO = productWithImagesDTO.ImagesDTO;
            Mode = mode;
        }
        public Product(ProductDTO productWithImagesDTO, EnMode mode = EnMode.Add)
        {
            this.ProductID = productWithImagesDTO.ProductID;
            this.CreatedAt = productWithImagesDTO.CreatedAt;
            this.CategoryID = productWithImagesDTO.CategoryID;
            this.ProductName = productWithImagesDTO.ProductName;
            this.Description = productWithImagesDTO.Description;
            this.Price = productWithImagesDTO.Price;
            this.Discount = productWithImagesDTO.Discount;
            this.Rating = productWithImagesDTO.Rating;
            this.QuantityInStock = productWithImagesDTO.QuantityInStock;
            this.ImagesDTO = productWithImagesDTO.ImagesDTO;
            this.Category = productWithImagesDTO.Category;
            Mode = mode;
        }
        public AddDTO AddProductDTO
        {
            get
            {
                return new AddDTO
                {
                    CategoryID = CategoryID,
                    ProductName = ProductName,
                    Description = Description,
                    Price = Price,
                    Discount = Discount,
                    Rating = Rating,
                    QuantityInStock = QuantityInStock,
                    ImagesDTO = ImagesDTO,
                };
            }

        }
        public ProductDTO ProductDTO
        {
            get
            {
                return new ProductDTO
                {
                    ProductID = ProductID,
                    CategoryID = CategoryID,
                    ProductName = ProductName,
                    Description = Description,
                    Price = Price,
                    Discount = Discount,
                    Rating = Rating,
                    QuantityInStock = QuantityInStock,
                    ImagesDTO = ImagesDTO,
                    Category = Category,
                    CreatedAt = CreatedAt,
                };
            }

        }
        public async Task<bool> AddImages(List<ImageDTO> imageDTOs)
        {
            if (Mode == EnMode.Update)
                await ProductRepository.DeleteProductImageAsync(ProductID);

            for (int i = 0; i < imageDTOs?.Count; i++)
            {
                if (await ProductRepository.AddProductImageAsync(imageDTOs[i], ProductID) == -1)
                {
                    return false;
                }
            }
            return true;
        }

        public static async Task<Product> FindProductByIDAsync(int ProductID)
        {
            if (ProductID <= 0)
            {
                throw new InvalidOperationException("ProductID not valid");
            }
            ProductDTO ProductDTO = await ProductRepository.GetProuctByIDAsync(ProductID);
            if (ProductDTO.ProductID == -1)
            {
                throw new InvalidOperationException("Product not found");
            }
            else
                return new Product(ProductDTO, EnMode.Update);
        }

        private async Task<bool> _AddProductAsync()
        {
            if (await IsProductTitleExistedAsyn(AddProductDTO.ProductName))
            {
                throw new InvalidOperationException("Title has been taken");
            }

            this.ProductID = await ProductRepository.AddProductAsync(AddProductDTO);
            if (this.ProductID != -1)
            {
                if (await AddImages(AddProductDTO.ImagesDTO))
                {
                    return true;
                }
                else
                    throw new InvalidOperationException("Error adding Images");
            }
            throw new InvalidOperationException("Error adding Product");

        }
        private async Task<bool> _UpdateProductAsync()
        {

            return await ProductRepository.UpdateProductAsync(AddProductDTO, ProductID);
        }
        public async Task<bool> SaveAsync()
        {
            switch (Mode)
            {
                case EnMode.Add:
                    if (await _AddProductAsync())
                    {
                        Mode = EnMode.Update;
                        return true;
                    }
                    return false;
                case EnMode.Update:
                    return await _UpdateProductAsync();
                default:
                    return false;
            }
        }
        public static async Task<bool> IsProductTitleExistedAsyn(string ProductName)
        {
            if (string.IsNullOrEmpty(ProductName))
            {
                throw new InvalidOperationException("Product Name not valid");
            }
            return await ProductRepository.IsProductTitleExisted(ProductName);
        }
        public static async Task<bool> IsProductExist(int ProductID)
        {
            if (ProductID < 1)
            {
                throw new InvalidOperationException("ProductID not Valid");
            }
            return await ProductRepository.IsProductIDExisted(ProductID);
        }
        public static async Task<bool> DeleteProduct(int ProductID)
        {
            if (ProductID < 1)
            {
                throw new InvalidOperationException("Product ID not Valid");
            }
            return await ProductRepository.DeleteProductAsync(ProductID);
        }

        public static async Task<IEnumerable<ProductDTO>> GetProductsAsync(int pageNumber, int LimitOfProducts)
        {
            if (pageNumber < 0)
            {
                pageNumber = 1;
            }
            if (LimitOfProducts < 0)
            {
                pageNumber = 1;
            }
            return await ProductRepository.GetAllProductsAsync(new DataAccess.Services.PageFilter(pageNumber, LimitOfProducts));
        }

        public static async Task<IEnumerable<ProductDTO>> GetLatestProductsAsync(int pageNumber, int LimitOfProducts)
        {
            if (pageNumber < 0)
            {
                pageNumber = 1;
            }
            if (LimitOfProducts < 0)
            {
                pageNumber = 1;
            }
            return await ProductRepository.GetLatestProductsAsync(new DataAccess.Services.PageFilter(pageNumber, LimitOfProducts));
        }


        public static async Task<IEnumerable<ProductDTO>> GetBestSellerProductsAsync(int pageNumber, int LimitOfProducts)
        {
            if (pageNumber < 0)
            {
                pageNumber = 1;
            }
            if (LimitOfProducts < 0)
            {
                pageNumber = 1;
            }
            return await ProductRepository.GetBestSellerProductsAsync(new DataAccess.Services.PageFilter(pageNumber, LimitOfProducts));
        }

        private static FilterType.Product getProductFilterType(string FilterType)
        {
            switch (FilterType.ToLower())
            {
                case "rating": return DataAccess.Filters.FilterType.Product.Rating;
                case "category": return DataAccess.Filters.FilterType.Product.Category;
                case "price": return DataAccess.Filters.FilterType.Product.Price;
                case "productname": return DataAccess.Filters.FilterType.Product.ProductName;
                default: return DataAccess.Filters.FilterType.Product.ProductName;
            }
        }
        public static async Task<IEnumerable<ProductDTO>> FilterAsync(string filterType, string value, int pageNumber, int LimitOfProducts)
        {
            if (pageNumber < 0)
            {
                pageNumber = 1;
            }

            if (LimitOfProducts < 0)
            {
                pageNumber = 1;
            }
            if (string.IsNullOrEmpty(value))
            {
                throw new InvalidOperationException($"Text Search not Valid");
            }
            if (string.IsNullOrEmpty(filterType))
            {
                throw new InvalidOperationException($"{filterType} not Valid");
            }
            return await ProductRepository.GetProductsByFilter(getProductFilterType(filterType), new DataAccess.Services.ValueFilter { value = value, page = new DataAccess.Services.PageFilter(pageNumber, LimitOfProducts) });
        }

    }
}