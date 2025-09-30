using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DataAccess.DTOS.Product;
using DataAccess.DTOS.Product.Image;
using DataAccess.Services;
using Microsoft.Data.SqlClient;
using Newtonsoft.Json;

namespace DataAccess.Repositories.Product.Queries
{
    public class GetBestSellerProductsQuery
    {
        private const string query = @"WITH BestSellerProducts AS (
            SELECT 
                Products.ProductID, 
                Products.ProductName, 
                Products.CategoryID, 
                Categories.Title, 
                Products.Price, 
                Products.Discount,
                Products.QuantityInStock, 
                Products.Description, 
                Products.Rating, 
                Products.CreatedDate,
                (SELECT Image FROM ProductsImages WHERE ProductsImages.ProductID = Products.ProductID FOR JSON PATH) AS Images,
                SUM(OrderDetails.Quantity) AS TotalSold,
                COUNT(DISTINCT OrderDetails.OrderDetailID) AS OrderCount
            FROM Products 
            INNER JOIN Categories ON Products.CategoryID = Categories.CategoryID
            INNER JOIN OrderDetails ON Products.ProductID = OrderDetails.ProductID
            GROUP BY 
                Products.ProductID, Products.ProductName, Products.CategoryID, Categories.Title,
                Products.Price, Products.Discount, Products.QuantityInStock, Products.Description,
                Products.Rating, Products.CreatedDate
            HAVING SUM(OrderDetails.Quantity) >= 5
        ),
        TotalCount AS (
            SELECT COUNT(*) AS TotalProducts FROM BestSellerProducts
        )
        SELECT 
            ProductID, ProductName, CategoryID, Title, Price, Discount,
            QuantityInStock, Description, Rating, CreatedDate, Images,
            TotalSold, OrderCount,
            (SELECT TotalProducts FROM TotalCount) AS TotalProducts
        FROM BestSellerProducts
        ORDER BY TotalSold DESC, Rating DESC
        OFFSET @Offset ROWS FETCH NEXT @Limit ROWS ONLY";

        public static async Task<IEnumerable<ProductDTO>> ExecuteAsync(PageFilter page)
        {
            var products = new List<ProductDTO>();
            int TotalProducts = 0;
            int offset = (page.pageNumber - 1) * page.limitOfUsers;

            using (SqlConnection connection = new SqlConnection(clsDataAccessSettings.connectionString))
            using (SqlCommand command = new SqlCommand(query, connection))
            {
                command.Parameters.AddWithValue("@Offset", offset);
                command.Parameters.AddWithValue("@Limit", page.limitOfUsers);

                try
                {
                    await connection.OpenAsync();
                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            TotalProducts = reader.GetInt32(reader.GetOrdinal("TotalProducts"));
                            products.Add(
                                new ProductDTO(
                                    reader.GetInt32(reader.GetOrdinal("ProductID")),
                                    reader.GetInt32(reader.GetOrdinal("CategoryID")),
                                    reader.GetString(reader.GetOrdinal("ProductName")).Trim(),
                                    reader.GetString(reader.GetOrdinal("Description")).Trim(),
                                    reader.GetDecimal(reader.GetOrdinal("Price")),
                                    reader.GetDecimal(reader.GetOrdinal("Discount")),
                                    reader.GetDouble(reader.GetOrdinal("Rating")),
                                    reader.GetInt32(reader.GetOrdinal("QuantityInStock")),
                                    reader.GetDateTime(reader.GetOrdinal("CreatedDate")),
                                    reader.GetString(reader.GetOrdinal("Title")).Trim(),
                                    reader["Images"] != DBNull.Value ?
                                        JsonConvert.DeserializeObject<List<ImageDTO>>(reader.GetString(reader.GetOrdinal("Images")))!
                                        : []
                                )
                            );
                        }
                    }
                }
                catch (SqlException)
                {
                    // Log SQL exceptions
                    // _logger.LogError(sqlEx, "An SQL error occurred while fetching best seller products.");
                    throw; // Optionally rethrow the exception or handle it as needed
                }
                catch (Exception)
                {
                    // Log general exceptions
                    // _logger.LogError(ex, "An error occurred while fetching best seller products.");
                    throw; // Optionally rethrow the exception or handle it as needed
                }
            }
            return products;
        }
    }
}