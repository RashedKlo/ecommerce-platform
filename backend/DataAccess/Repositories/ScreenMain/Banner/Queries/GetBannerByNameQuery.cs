using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DataAccess.DTOS.ScreenMain.Banner;
using DataAccess.DTOS.ScreenMain.Boxes;
using Microsoft.Data.SqlClient;

namespace DataAccess.Repositories.ScreenMain.Banner.Queries
{
    public class GetBannerByNameQuery
    {
        public static async Task<BannerDTO> ExcuteAsync(string BannerName)
        {
            BannerDTO banner = new(); // Initialize as null
            string query = @"
                SELECT 
                    B.BannerName,
                    B.Image AS BannerImage,
                    B.Link AS BannerLink,
                    B.Title AS BannerTitle,
                    B.Subtitle AS BannerSubtitle,
                    B.BtnText AS BannerBtnText,
                    BB.ID AS BlendedBoxID,
                    BB.Title AS BlendedBoxTitle,
                    BB.Image AS BlendedBoxImage,
                    BB.Price AS BlendedBoxPrice,
                    BB.Discount AS BlendedBoxDiscount
                FROM 
                    Banners B
                LEFT JOIN 
                    BlendedBox BB ON B.BannerName = BB.BannerName
                WHERE 
                    B.BannerName = @BannerName;";

            using (var connection = new SqlConnection(clsDataAccessSettings.connectionString))
            {
                await connection.OpenAsync(); // Open the connection asynchronously

                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@BannerName", BannerName);

                    using (SqlDataReader reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            if (string.IsNullOrEmpty(banner.BannerName))
                            {
                                banner = new BannerDTO
                                {
                                    BannerName = reader["BannerName"]?.ToString() ?? string.Empty,
                                    Image = reader["BannerImage"]?.ToString() ?? string.Empty,
                                    Link = reader["BannerLink"]?.ToString() ?? string.Empty,
                                    Title = reader["BannerTitle"]?.ToString() ?? string.Empty,
                                    Subtitle = reader["BannerSubtitle"]?.ToString() ?? string.Empty,
                                    BtnText = reader["BannerBtnText"]?.ToString() ?? string.Empty,
                                    BlendedBoxes = new List<BoxDTO>() // Initialize the list
                                };
                            }

                            if (reader["BlendedBoxID"] != DBNull.Value)
                            {
                                banner.BlendedBoxes.Add(new BoxDTO
                                {
                                    ID = Convert.ToInt32(reader["BlendedBoxID"]),
                                    Title = reader["BlendedBoxTitle"]?.ToString() ?? string.Empty,
                                    Image = reader["BlendedBoxImage"]?.ToString() ?? string.Empty,
                                    Price = reader["BlendedBoxPrice"] != DBNull.Value ? Convert.ToDecimal(reader["BlendedBoxPrice"]) : 0,
                                    Discount = reader["BlendedBoxDiscount"] != DBNull.Value ? Convert.ToDecimal(reader["BlendedBoxDiscount"]) : 0,
                                });
                            }
                        }
                    }
                }
            }

            return banner ?? new BannerDTO(); // Return an empty BannerDTO if no data is found
        }

    }
}