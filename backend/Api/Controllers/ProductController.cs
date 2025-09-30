
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Api.models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using DataAccess;
using DataAccess.DTOS.User;
using BussinessAccess;
using System.Threading.Tasks;
using DataAccess.DTOS.Product;
using System.Text;
namespace Api.Controllers
{
    [ApiController]
    [Route("Api/Products")]

    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]

    public class ProductApiController : ControllerBase
    {

        [HttpGet("All", Name = "GetAllProducts")]
        // [Authorize(Roles = "Admin")] 
        [Authorize(Policy = "Admins")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<ActionResult<List<ProductDTO>>> GetAllProducts(int pageNumber, int LimitOfProducts)
        {
            IEnumerable<ProductDTO> Products = await BussinessAccess.Product.GetProductsAsync(pageNumber, LimitOfProducts);
            if (Products.Count() == 0)
                return NotFound("Products not Found");
            else
                return Ok(new { data = Products.ToList() });
        }

        // [Authorize(Roles = "Admin")] 
        //     [Authorize(Policy = "Admins")]
        [HttpGet("Latest", Name = "GetLatestProductsAsync")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<ActionResult<List<ProductDTO>>> GetLatestProductsAsync(int pageNumber, int LimitOfProducts)
        {
            IEnumerable<ProductDTO> Products = await BussinessAccess.Product.GetLatestProductsAsync(pageNumber, LimitOfProducts);
            if (Products.Count() == 0)
                return NotFound("Products not Found");
            else
                return Ok(new { data = Products.ToList() });
        }

        [HttpGet("BestSeller", Name = "GetBestSellerProductsAsync")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<ActionResult<List<ProductDTO>>> GetBestSellerProductsAsync(int pageNumber, int LimitOfProducts)
        {
            IEnumerable<ProductDTO> Products = await BussinessAccess.Product.GetBestSellerProductsAsync(pageNumber, LimitOfProducts);
            if (Products.Count() == 0)
                return NotFound("Products not Found");
            else
                return Ok(new { data = Products.ToList() });
        }












        [HttpGet("Export", Name = "ExportProducts")]
        [Authorize(Policy = "Admins")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> ExportProducts(int pageNumber, int LimitOfProducts)
        {
            IEnumerable<ProductDTO> Products = await BussinessAccess.Product.GetProductsAsync(pageNumber, LimitOfProducts);
            if (Products.Count() == 0)
                return NotFound("Products not Found");

            var csvData = ConvertToCsv(Products.ToList());

            // Ensure UTF-8 encoding (with BOM to handle special characters)
            var bytes = Encoding.UTF8.GetBytes("\uFEFF" + csvData);
            var fileStream = new MemoryStream(bytes);

            return File(fileStream, "text/csv", "Products.csv");
        }

        private string ConvertToCsv(List<ProductDTO> Products)
        {
            var sb = new StringBuilder();
            // Use semicolon as separator
            string separator = ";";

            // CSV Header with semicolon delimiter
            sb.AppendLine($"\"ProductID\"{separator}\"Name\"{separator}\"Category\"{separator}\"Price\"{separator}\"Quantity\"{separator}\"Rating\"{separator}\"CreatedAt\"");

            foreach (var product in Products)
            {
                // If the Country property is an object, you might need to extract a specific value (e.g., product.Country.Name)
                sb.AppendLine(
                    $"\"{product.ProductID}\"{separator}" +
                    $"\"{product.ProductName}\"{separator}" +
                    $"\"{product.Category}\"{separator}" +
                    $"\"{product.Price}\"{separator}" +
                    $"\"{product.QuantityInStock}\"{separator}" +
                    $"\"{product.Rating}\"{separator}" +
                    $"\"{product.CreatedAt.ToShortDateString()}\""
                );
            }

            return sb.ToString();
        }












        [HttpDelete("Delete/{ProductID}", Name = "DeleteProduct")]
        [Authorize(Policy = "Admins")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<ActionResult> DeleteProduct(int ProductID)
        {
            try
            {
                if (await BussinessAccess.Product.DeleteProduct(ProductID))
                    return Ok("Product is Deleted");
                else
                    return NotFound($"Product with ID : {ProductID} does not deleted");
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }




        // [Authorize(Policy = "AgeGreaterThan25")]
        [HttpGet("Get/{ProductID}", Name = "GetProductByID")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [Authorize(Policy = "Admins")]
        public async Task<ActionResult<ProductDTO?>> GetProductByID(int ProductID)
        {
            try
            {
                var product = await BussinessAccess.Product.FindProductByIDAsync(ProductID);
                return product.ProductDTO;
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }

        }







        // [Authorize(Policy = "Admins")]
        [HttpPut("Update/{ProductID}", Name = "UpdateProductAsync")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [AllowAnonymous]
        public async Task<ActionResult> UpdateProductAsync(int ProductID, AddDTO ProductDTO)
        {
            try
            {
                var Product = await BussinessAccess.Product.FindProductByIDAsync(ProductID);
                if (Product == null)
                {
                    return NotFound($"Product with ID: {ProductID} not found.");
                }
                if (Product.ProductName != ProductDTO.ProductName && await Product.IsProductTitleExistedAsyn(ProductDTO.ProductName))
                {
                    return Conflict("Product Name has been taken");
                }
                Product.ProductName = ProductDTO.ProductName;
                Product.CategoryID = ProductDTO.CategoryID;
                Product.Description = ProductDTO.Description;
                Product.Price = ProductDTO.Price;
                Product.Discount = ProductDTO.Discount;
                Product.Rating = ProductDTO.Rating;
                Product.QuantityInStock = ProductDTO.QuantityInStock;
                if (await Product.SaveAsync())
                {
                    //  Product.DeleteImagesByProductID(Product.ProductID);
                    if (!await Product.AddImages(ProductDTO.ImagesDTO))
                    {
                        return StatusCode(500, new { message = "Error updating Images" });
                    }
                    return Ok("Product is Updated");
                }
                else
                    return StatusCode(500, new { message = "Error Updating Product" });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }



        [HttpPost("Add", Name = "AddProduct")]
        [AllowAnonymous]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult> AddProduct(AddDTO productDTO)
        {
            try
            {
                Product Product = new(productDTO, BussinessAccess.Product.EnMode.Add);
                if (await Product.SaveAsync())
                {
                    return Created("Added Successfuly", new { Product = Product.ProductDTO });
                }
                else
                {
                    return StatusCode(500, "Error Adding Product");
                }
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }

        }

        [HttpGet("Filter", Name = "FilterProducts")]
        // [Authorize(Roles = "Admin")] 
        [Authorize(Policy = "Admins")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<ActionResult<List<ProductDTO>>> FilterProducts(string filterType, string value, int pageNumber, int LimitOfProducts)
        {
            IEnumerable<ProductDTO> Products = await BussinessAccess.Product.FilterAsync(filterType, value, pageNumber, LimitOfProducts);
            if (Products.Count() == 0)
                return NotFound("Products not Found");
            else
                return Ok(new { data = Products.ToList() });
        }

    }
}