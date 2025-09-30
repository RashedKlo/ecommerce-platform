using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DataAccess.DTOS.Product;
using Microsoft.Data.SqlClient;

namespace DataAccess.Repositories.Product.Commands
{
    public class AddProductCommand
    {
        private const string query = @"Insert Into Products(CategoryID,ProductName,Description,Price,Discount,QuantityInStock,Rating,CreatedDate) 
            Values(@CategoryID,@ProductName,@Description,@Price,@Discount,@QuantityInStock,@Rating,@CreatedDate)  SELECT SCOPE_IDENTITY()";
        public static async Task<int> ExcuteAsync(AddDTO product)
        {

            int personID = -1;

            using (SqlConnection connection = new SqlConnection(clsDataAccessSettings.connectionString))
            using (SqlCommand command = new SqlCommand(query, connection))
            {
                command.Parameters.AddWithValue("CategoryID", product.CategoryID);
                command.Parameters.AddWithValue("ProductName", product.ProductName);
                command.Parameters.AddWithValue("Description", product.Description);
                command.Parameters.AddWithValue("Price", product.Price);
                command.Parameters.AddWithValue("Discount", product.Discount);
                command.Parameters.AddWithValue("Rating", product.Rating);
                command.Parameters.AddWithValue("CreatedDate", DateTime.UtcNow);
                command.Parameters.AddWithValue("QuantityInStock", product.QuantityInStock);

                try
                {
                    await connection.OpenAsync();
                    var result = await command.ExecuteScalarAsync();
                    if (result != null && int.TryParse(result.ToString(), out int insertedID))
                    {
                        personID = insertedID;
                    }
                }
                catch (SqlException)
                {
                    // Log SQL exceptions
                    // _logger.LogError(sqlEx, "An SQL error occurred while adding the user.");
                    throw; // Optionally rethrow the exception or handle it as needed
                }
                catch (Exception)
                {
                    // Log general exceptions
                    // _logger.LogError(ex, "An error occurred while adding the user.");
                    throw; // Optionally rethrow the exception or handle it as needed
                }
            }

            return personID;
        }

    }
}