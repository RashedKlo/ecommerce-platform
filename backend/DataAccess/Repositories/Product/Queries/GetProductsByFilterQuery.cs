using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DataAccess.DTOS.Product;
using DataAccess.DTOS.Product.Image;
using DataAccess.Filters;
using DataAccess.Services;
using Microsoft.Data.SqlClient;
using Newtonsoft.Json;

namespace DataAccess.Repositories.Product.Queries
{
    public class GetProductsByFilterQuery
    {
        private static string query = @"SELECT Products.ProductID, Products.ProductName, Products.CategoryID, Categories.Title, Products.Price, Products.Discount,
             Products.QuantityInStock, Products.Description, Products.Rating, Products.CreatedDate,
            (select Image from ProductsImages where ProductsImages.ProductID=Products.ProductID  FOR JSON PATH ) as Images,
            (SELECT COUNT(ProductID) From Products)As TotalProducts
             FROM Products INNER JOIN Categories ON Products.CategoryID = Categories.CategoryID 
             where Filter
             ORDER BY ProductID OFFSET @Offset ROWS FETCH NEXT @Limit ROWS ONLY";
        public static async Task<IEnumerable<ProductDTO>> ExcuteAsync(FilterType.Product Type, ValueFilter valueFilter)
        {
            var products = new List<ProductDTO>();
            int TotalProducts = 0;
            int offset = (valueFilter.page.pageNumber - 1) * valueFilter.page.limitOfUsers;

            if (Type == FilterType.Product.ProductName)
                query = query.Replace("Filter", "ProductName like @value+'%'");
            else if (Type == FilterType.Product.Rating)
                query = query.Replace("Filter", "Rating = @value");
            else if (Type == FilterType.Product.Price)
                query = query.Replace("Filter", "Price =@value");
            else if (Type == FilterType.Product.Category)
                query = query.Replace("Filter", "Categories.Title like @value+'%'");




            using (SqlConnection connection = new SqlConnection(clsDataAccessSettings.connectionString))
            using (SqlCommand command = new SqlCommand(query, connection))
            {
                command.Parameters.AddWithValue("@Offset", offset);
                command.Parameters.AddWithValue("@value", valueFilter.value);
                command.Parameters.AddWithValue("@Limit", valueFilter.page.limitOfUsers);
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
                        JsonConvert.DeserializeObject<List<ImageDTO>>(reader.GetString(reader.GetOrdinal("Images")))
                        ! : []));
                        }
                    }
                }
                catch (SqlException)
                {
                    // Log SQL exceptions
                    // _logger.LogError(sqlEx, "An SQL error occurred while fetching users.");
                    throw; // Optionally rethrow the exception or handle it as needed
                }
                catch (Exception)
                {
                    // Log general exceptions
                    // _logger.LogError(ex, "An error occurred while fetching users.");
                    throw; // Optionally rethrow the exception or handle it as needed
                }
            }

            return products;
        }

    }
}