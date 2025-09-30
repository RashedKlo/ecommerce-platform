using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DataAccess.DTOS.ScreenMain.Banner;
using Microsoft.Data.SqlClient;

namespace DataAccess.Repositories.ScreenMain.Banner.Commands
{
    public class UpdateBannerCommand
    {
        public static async Task<bool> ExcuteAsync(AddDTO banner, string BannerName)
        {
            string query = @"UPDATE Banners SET 
                   Image = @Image,
                   Link = @Link,
                   Title = @Title,
                   Subtitle = @Subtitle,
                   BtnText = @BtnText 
                   WHERE BannerName = @BannerName";

            using (SqlConnection connection = new SqlConnection(clsDataAccessSettings.connectionString))
            {
                await connection.OpenAsync();
                using (SqlTransaction transaction = connection.BeginTransaction())
                using (SqlCommand command = new SqlCommand(query, connection, transaction))
                {
                    command.Parameters.AddWithValue("BannerName", BannerName.ToLower());
                    command.Parameters.AddWithValue("Image", banner.Image);
                    command.Parameters.AddWithValue("Link", banner.Link);
                    command.Parameters.AddWithValue("Title", string.IsNullOrEmpty(banner.Title) ? DBNull.Value : banner.Title);
                    command.Parameters.AddWithValue("Subtitle", string.IsNullOrEmpty(banner.Subtitle) ? DBNull.Value : banner.Subtitle);
                    command.Parameters.AddWithValue("BtnText", string.IsNullOrEmpty(banner.BtnText) ? DBNull.Value : banner.BtnText);

                    try
                    {
                        int rowsAffected = await command.ExecuteNonQueryAsync();


                        await transaction.CommitAsync();
                        return rowsAffected > 0;
                    }
                    catch
                    {
                        await transaction.RollbackAsync();
                        throw;
                    }
                }
            }
        }

    }


}