using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DataAccess.DTOS.OrderDetails;
using Microsoft.Data.SqlClient;

namespace DataAccess.Repositories.OrderDetails.Commands
{
    public class AddOrderDetailCommand
    {
        private const string query = @"Insert Into OrderDetails(ProductID,OrderID,UnitPrice,Quantity,Discount) 
            Values(@ProductID,@OrderID,@UnitPrice,@Quantity,@Discount)  SELECT SCOPE_IDENTITY()";
        public static async Task<int> ExcuteAsync(AddDTO orderDetailsDTO)
        {

            int personID = -1;

            using (SqlConnection connection = new SqlConnection(clsDataAccessSettings.connectionString))
            using (SqlCommand command = new SqlCommand(query, connection))
            {
                command.Parameters.AddWithValue("ProductID", orderDetailsDTO.ProductID);
                command.Parameters.AddWithValue("OrderID", orderDetailsDTO.OrderID);
                command.Parameters.AddWithValue("UnitPrice", orderDetailsDTO.UnitPrice);
                command.Parameters.AddWithValue("Quantity", orderDetailsDTO.Quantity);
                command.Parameters.AddWithValue("Discount", orderDetailsDTO.Discount);

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