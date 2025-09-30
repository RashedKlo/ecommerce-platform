using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DataAccess.DTOS.Product;
using DataAccess.DTOS.Product.Image;
using DataAccess.Filters;

using DataAccess.Repositories.Product.Commands;
using DataAccess.Repositories.Product.Queries;
using DataAccess.Services;

namespace DataAccess.Repositories.Product
{
    public class ProductRepository
    {
        public async static Task<int> AddProductAsync(AddDTO product)
        {
            return await AddProductCommand.ExcuteAsync(product);
        }
        public async static Task<int> AddProductImageAsync(ImageDTO ProductImageDTO, int ProductID)
        {
            return await AddProductImageCommand.ExcuteAsync(ProductImageDTO, ProductID);
        }
        public static async Task<bool> DeleteProductAsync(int ProductID)
        {
            return await DeleteProductCommand.ExcuteAsync(ProductID);
        }
        public static async Task<bool> DeleteProductImageAsync(int ProductID)
        {
            return await DeleteProductImageCommand.ExcuteAsync(ProductID);
        }
        public static async Task<bool> UpdateProductAsync(AddDTO product, int ProductID)
        {
            return await UpdateProductCommand.ExcuteAsync(product, ProductID);

        }
        public static async Task<IEnumerable<ProductDTO>> GetAllProductsAsync(PageFilter page)
        {
            return await GetAllProductsQuery.ExcuteAsync(page);
        }
        public static async Task<IEnumerable<ProductDTO>> GetLatestProductsAsync(PageFilter page)
        {
            return await GetLatestProductsQuery.ExcuteAsync(page);
        }
        public static async Task<IEnumerable<ProductDTO>> GetBestSellerProductsAsync(PageFilter page)
        {
            return await GetBestSellerProductsQuery.ExecuteAsync(page);
        }
        public static async Task<ProductDTO> GetProuctByIDAsync(int ProductID)
        {
            return await GetProductByIDQuery.ExcuteAsync(ProductID);
        }
        public static async Task<IEnumerable<ProductDTO>> GetProductsByFilter(FilterType.Product Type, ValueFilter valueFilter)
        {
            return await GetProductsByFilterQuery.ExcuteAsync(Type, valueFilter);
        }
        public static async Task<bool> IsProductIDExisted(int ProductID)
        {
            return await IsProductIDExistedQuery.ExcuteAsync(ProductID);
        }
        public static async Task<bool> IsProductTitleExisted(string ProductName)
        {
            return await IsProductTitleExistedQuery.ExcuteAsync(ProductName);
        }
    }
}