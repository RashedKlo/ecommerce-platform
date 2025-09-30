using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DataAccess.DTOS.Product;
using Microsoft.Data.SqlClient;

namespace DataAccess.Repositories.Product.Commands
{
    public class UpdateProductCommand
    {
        private const string query = @"Update Products
            Set CategoryID=@CategoryID,ProductName=@ProductName,Description=@Description,Price=@Price,
            QuantityInStock=@QuantityInStock,Discount=@Discount,Rating=@Rating where ProductID=@ProductID";

        public static async Task<bool> ExcuteAsync(AddDTO product, int ProductID)
        {

            using (SqlConnection connection = new SqlConnection(clsDataAccessSettings.connectionString))
            using (SqlCommand command = new SqlCommand(query, connection))
            {
                command.Parameters.AddWithValue("ProductID", ProductID);
                command.Parameters.AddWithValue("CategoryID", product.CategoryID);
                command.Parameters.AddWithValue("ProductName", product.ProductName);
                command.Parameters.AddWithValue("Description", product.Description);
                command.Parameters.AddWithValue("Price", product.Price);
                command.Parameters.AddWithValue("QuantityInStock", product.QuantityInStock);
                command.Parameters.AddWithValue("Discount", product.Discount);
                command.Parameters.AddWithValue("Rating", product.Rating);


                try
                {
                    await connection.OpenAsync();
                    int rowsAffected = await command.ExecuteNonQueryAsync();
                    return rowsAffected > 0;
                }
                catch (SqlException)
                {
                    // Log SQL exceptions
                    // _logger.LogError(sqlEx, "An SQL error occurred while updating the user.");
                    throw; // Optionally rethrow the exception or handle it as needed
                }
                catch (Exception)
                {
                    // Log general exceptions
                    // _logger.LogError(ex, "An error occurred while updating the user.");
                    throw; // Optionally rethrow the exception or handle it as needed
                }
            }
        }

    }
}