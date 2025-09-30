using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BussinessAccess;
using DataAccess.DTOS.ScreenMain.Banner;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    [ApiController]
    [Route("Api/Banners")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]

    public class BannerController : ControllerBase
    {
        [HttpGet("Get/{BannerName}", Name = "GetBannerName")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        // [Authorize(Policy = "Admins")]
        [AllowAnonymous]
        public async Task<ActionResult<BannerDTO?>> GetBannerName(string BannerName)
        {
            try
            {
                var Banner = await BussinessAccess.Banner.GetBanner(BannerName);
                return Banner.BannerDTO;
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }

        }





        [HttpPost("Handle/{BannerName}", Name = "HandleBanner")]
        [AllowAnonymous]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult> HandleBanner(AddDTO bannerDTO, string BannerName)
        {
            try
            {

                if (await Banner.HandleBanner(bannerDTO, BannerName))
                {
                    return StatusCode(201, " Adding Successfully Banner");
                }
                else
                {
                    return StatusCode(500, "Error Adding Banner");
                }
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }

        }








    }
}