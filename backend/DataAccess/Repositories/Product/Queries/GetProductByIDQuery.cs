using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DataAccess.DTOS.Product;
using DataAccess.DTOS.Product.Image;
using Microsoft.Data.SqlClient;
using Newtonsoft.Json;

namespace DataAccess.Repositories.Product.Queries
{
    public class GetProductByIDQuery
    {
        private const string query = @"SELECT Products.ProductID, Products.ProductName, Products.CategoryID, Products.Price, Products.Discount,
                          Categories.Title,Products.QuantityInStock, Products.Description, Products.Rating, Products.CreatedDate,
            (select Image from ProductsImages where ProductsImages.ProductID=Products.ProductID  FOR JSON PATH ) as Images
             FROM Products INNER JOIN Categories ON Products.CategoryID = Categories.CategoryID 
            where ProductID=@ProductID";
        public static async Task<ProductDTO> ExcuteAsync(int ProductID)
        {
            ProductDTO product = new();


            using (var connection = new SqlConnection(clsDataAccessSettings.connectionString))
            using (var command = new SqlCommand(query, connection))
            {
                command.Parameters.AddWithValue("@ProductID", ProductID);

                try
                {
                    await connection.OpenAsync();
                    using var reader = await command.ExecuteReaderAsync();
                    if (await reader.ReadAsync())
                    {
                        product = new ProductDTO
                    (
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
                        ! : []
                    );
                    }
                }
                catch (Exception)
                {
                    // Handle the exception (e.g., log it)
                    // Console.WriteLine("Error: " + ex.Message);
                    throw;
                }
            }

            return product;
        }

    }
}