using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BussinessAccess;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using DataAccess.DTOS.OrderDetails;

namespace Api.Controllers
{
    [ApiController]
    [Route("Api/OrderDetails")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]

    public class OrderDetailApiController : ControllerBase
    {
        [HttpGet("All", Name = "GetAllOrdersDetails")]
        // [Authorize(Roles = "Admin")] 
        [Authorize(Policy = "Admins")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<ActionResult<List<OrderDetailDTO>>> GetAllOrdersDetails(int OrderID, int pageNumber, int LimitOfOrdersDetails)
        {
            IEnumerable<OrderDetailDTO> OrdersDetails = await BussinessAccess.OrderDetail.GetOrdersDetails(OrderID, pageNumber, LimitOfOrdersDetails);
            if (OrdersDetails.Count() == 0)
                return NotFound("OrdersDetails not Found");
            else
                return Ok(new { data = OrdersDetails.ToList() });
        }





        [HttpGet("Export", Name = "ExportOrderDetails")]
        [Authorize(Policy = "Admins")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> ExportOrderDetails(int OrderID, int pageNumber, int LimitOfOrdersDetails)
        {
            IEnumerable<OrderDetailDTO> OrdersDetails = await BussinessAccess.OrderDetail.GetOrdersDetails(OrderID, pageNumber, LimitOfOrdersDetails);
            if (OrdersDetails.Count() == 0)
                return NotFound("OrdersDetails not Found");

            var csvData = ConvertToCsv(OrdersDetails.ToList());

            // Ensure UTF-8 encoding (with BOM to handle special characters)
            var bytes = Encoding.UTF8.GetBytes("\uFEFF" + csvData);
            var fileStream = new MemoryStream(bytes);

            return File(fileStream, "text/csv", "OrderDetails.csv");
        }

        private string ConvertToCsv(List<OrderDetailDTO> orders)
        {
            var sb = new StringBuilder();
            // Use semicolon as separator
            string separator = ";";

            // CSV Header with semicolon delimiter
            sb.AppendLine($"\"OrderID\"{separator}\"Product\"{separator}\"Price\"{separator}\"Quantity\"{separator}\"Discount\"");

            foreach (var order in orders)
            {
                // If the Country property is an object, you might need to extract a specific value (e.g., order.Country.Name)
                sb.AppendLine(
                    $"\"{order.OrderDetailID}\"{separator}" +
                    $"\"{order.ProductName}\"{separator}" +
                    $"\"{order.UnitPrice}\"{separator}" +
                    $"\"{order.Quantity}\"{separator}" +
                    $"\"{order.Discount}\""
                );
            }

            return sb.ToString();
        }












        [HttpDelete("Delete/{OrderDetailID}", Name = "DeleteOrderDetail")]
        [Authorize(Policy = "Admins")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<ActionResult> DeleteOrderDetail(int OrderDetailID)
        {
            try
            {
                if (await BussinessAccess.OrderDetail.DeleteOrderDetail(OrderDetailID))
                    return Ok("OrderDetail is Deleted");
                else
                    return NotFound($"OrderDetail with ID : {OrderDetailID} does not deleted");
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }




        // [Authorize(Policy = "AgeGreaterThan25")]
        [HttpGet("Get/{OrderDetailID}", Name = "GetOrderDetail")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [Authorize(Policy = "Admins")]
        public async Task<ActionResult<OrderDetailDTO>> GetOrderDetail(int OrderDetailID)
        {
            try
            {
                var OrderDetail = await BussinessAccess.OrderDetail.FindOrderDetailByID(OrderDetailID);
                return OrderDetail.OrderDetailDTO;
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }

        }







        // [Authorize(Policy = "Admins")]
        [HttpPut("Update/{OrderDetailID}", Name = "UpdateOrderDetail")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [AllowAnonymous]
        public async Task<ActionResult> UpdateOrderDetail(int OrderDetailID, AddDTO OrderDetailDTO)
        {
            try
            {
                var OrderDetail = await BussinessAccess.OrderDetail.FindOrderDetailByID(OrderDetailID);
                if (OrderDetail == null)
                {
                    return NotFound($"OrderDetail with ID: {OrderDetailID} not found.");
                }

                OrderDetail.ProductID = OrderDetailDTO.ProductID;
                OrderDetail.OrderID = OrderDetailDTO.OrderID;
                OrderDetail.UnitPrice = OrderDetailDTO.UnitPrice;
                OrderDetail.Quantity = OrderDetailDTO.Quantity;
                OrderDetail.Discount = OrderDetailDTO.Discount;

                if (await OrderDetail.SaveAsync())
                    return Ok("OrderDetail is Updated");
                else
                    return StatusCode(500, new { message = "Error Updating OrderDetail" });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }



        [HttpPost("Add", Name = "AddOrderDetail")]
        [AllowAnonymous]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult> AddOrderDetail(AddDTO OrderDetailDTO)
        {
            try
            {
                OrderDetail OrderDetail = new(OrderDetailDTO, BussinessAccess.OrderDetail.EnMode.Add);
                if (await OrderDetail.SaveAsync())
                {
                    return Created("Added Successfuly", new { OrderDetail = OrderDetail.OrderDetailDTO });
                }
                else
                {
                    return StatusCode(500, "Error Adding OrderDetail");
                }
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }

        }

        [HttpGet("Filter", Name = "FilterOrderDetails")]
        // [Authorize(Roles = "Admin")] 
        [Authorize(Policy = "Admins")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<ActionResult<List<OrderDetailDTO>>> FilterOrderDetails(string filterType, int OrderID, string value, int pageNumber, int LimitOfOrders)
        {
            IEnumerable<OrderDetailDTO> Orders = await BussinessAccess.OrderDetail.FilterAsync(OrderID, filterType, value, pageNumber, LimitOfOrders);
            if (Orders.Count() == 0)
                return NotFound("Orders not Found");
            else
                return Ok(new { data = Orders.ToList() });
        }

    }
}