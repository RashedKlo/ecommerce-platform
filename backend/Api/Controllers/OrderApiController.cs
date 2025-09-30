using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BussinessAccess;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using DataAccess.DTOS.Order;

namespace Api.Controllers
{
    [ApiController]
    [Route("Api/Orders")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class OrderApiController : ControllerBase
    {

        [HttpGet("All", Name = "GetAllOrders")]
        // [Authorize(Roles = "Admin")] 
        [Authorize(Policy = "Admins")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<ActionResult<List<OrderDTO>>> GetAllOrders(int pageNumber, int LimitOfOrders)
        {
            IEnumerable<OrderDTO> Orders = await BussinessAccess.Order.GetOrders(pageNumber, LimitOfOrders);
            if (Orders.Count() == 0)
                return NotFound("Orders not Found");
            else
                return Ok(new { data = Orders.ToList() });
        }


        [HttpGet("Export", Name = "ExportOrder")]
        [Authorize(Policy = "Admins")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> ExportOrder(int pageNumber, int LimitOfOrders)
        {
            IEnumerable<OrderDTO> Orders = await BussinessAccess.Order.GetOrders(pageNumber, LimitOfOrders);
            if (Orders.Count() == 0)
                return NotFound("Orders not Found");

            var csvData = ConvertToCsv(Orders.ToList());

            // Ensure UTF-8 encoding (with BOM to handle special characters)
            var bytes = Encoding.UTF8.GetBytes("\uFEFF" + csvData);
            var fileStream = new MemoryStream(bytes);

            return File(fileStream, "text/csv", "Orders.csv");
        }

        private string ConvertToCsv(List<OrderDTO> orders)
        {
            var sb = new StringBuilder();
            // Use semicolon as separator
            string separator = ";";

            // CSV Header with semicolon delimiter
            sb.AppendLine($"\"OrderID\"{separator}\"Customer\"{separator}\"Status\"{separator}\"PaymentMethod\"{separator}\"OrderDate\"");

            foreach (var order in orders)
            {
                // If the Country property is an object, you might need to extract a specific value (e.g., order.Country.Name)
                sb.AppendLine(
                    $"\"{order.OrderID}\"{separator}" +
                    $"\"{order.UserName}\"{separator}" +
                    $"\"{order.OrderStatus}\"{separator}" +
                    $"\"{order.PaymentMethod}\"{separator}" +
                    $"\"{order.OrderDate.ToShortDateString()}\""
                );
            }

            return sb.ToString();
        }




        [HttpDelete("Delete/{OrderID}", Name = "DeleteOrder")]
        [Authorize(Policy = "Admins")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<ActionResult> DeleteOrder(int OrderID)
        {
            try
            {
                if (await BussinessAccess.Order.DeleteOrder(OrderID))
                    return Ok("Order is Deleted");
                else
                    return NotFound($"Order with ID : {OrderID} does not deleted");
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }




        // [Authorize(Policy = "AgeGreaterThan25")]
        [HttpGet("Get/{OrderID}", Name = "GetOrder")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [Authorize(Policy = "Admins")]
        public async Task<ActionResult<OrderDTO>> GetOrder(int OrderID)
        {
            try
            {
                var Order = await BussinessAccess.Order.FindOrderByID(OrderID);
                return Order.OrderDTO;
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }

        }







        // [Authorize(Policy = "Admins")]
        [HttpPut("Update/{OrderID}", Name = "UpdateOrder")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [AllowAnonymous]
        public async Task<ActionResult> UpdateOrder(int OrderID, AddDTO OrderDTO)
        {
            try
            {
                var Order = await BussinessAccess.Order.FindOrderByID(OrderID);
                if (Order == null)
                {
                    return NotFound($"Order with ID: {OrderID} not found.");
                }

                Order.UserID = OrderDTO.UserID;
                Order.OrderStatus = OrderDTO.OrderStatus;
                Order.PaymentMethod = OrderDTO.PaymentMethod;
                Order.Discount = OrderDTO.Discount;

                if (await Order.SaveAsync())
                    return Ok("Order is Updated");
                else
                    return StatusCode(500, new { message = "Error Updating Order" });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }



        [HttpPost("Add", Name = "AddOrder")]
        [AllowAnonymous]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult> AddOrder(AddDTO OrderDTO)
        {
            try
            {
                Order Order = new(OrderDTO, BussinessAccess.Order.EnMode.Add);
                if (await Order.SaveAsync())
                {
                    return Created("Added Successfuly", new { Order = Order.OrderDTO });
                }
                else
                {
                    return StatusCode(500, "Error Adding Order");
                }
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }

        }

        [HttpGet("Filter", Name = "FilterOrders")]
        // [Authorize(Roles = "Admin")] 
        [Authorize(Policy = "Admins")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<ActionResult<List<OrderDTO>>> FilterOrders(string filterType, string value, int pageNumber, int LimitOfOrders)
        {
            IEnumerable<OrderDTO> Orders = await BussinessAccess.Order.FilterAsync(filterType, value, pageNumber, LimitOfOrders);
            if (Orders.Count() == 0)
                return NotFound("Orders not Found");
            else
                return Ok(new { data = Orders.ToList() });
        }
    }
}