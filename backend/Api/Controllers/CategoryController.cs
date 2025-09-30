
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Api.models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using DataAccess;
using DataAccess.DTOS.User;
using BussinessAccess;
using System.Threading.Tasks;
using DataAccess.DTOS.Category;
using System.Text;
using System.Collections.Immutable;

namespace Api.Controllers
{
    [ApiController]
    [Route("Api/Categories")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]

    public class CategoryApiController : ControllerBase
    {
        [HttpGet("All", Name = "GetAllCategories")]
        // [Authorize(Roles = "Admin")] 
        [Authorize(Policy = "Admins")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<ActionResult<List<CategoryDTO>>> GetAllCategories(int pageNumber, int LimitOfCategories)
        {
            IEnumerable<CategoryDTO> Categories = await BussinessAccess.Category.GetCategoriesAsync(pageNumber, LimitOfCategories);
            if (Categories.Count() == 0)
                return NotFound("Categories not Found");
            else
                return Ok(new { data = Categories.ToList() });
        }




        [HttpGet("Export", Name = "ExportCategories")]
        [Authorize(Policy = "Admins")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> ExportCategories(int pageNumber, int LimitOfCategories)
        {
            IEnumerable<CategoryDTO> Categories = await BussinessAccess.Category.GetCategoriesAsync(pageNumber, LimitOfCategories);
            if (Categories.Count() == 0)
                return NotFound("Categories not Found");

            var csvData = ConvertToCsv(Categories.ToList());

            // Ensure UTF-8 encoding (with BOM to handle special characters)
            var bytes = Encoding.UTF8.GetBytes("\uFEFF" + csvData);
            var fileStream = new MemoryStream(bytes);

            return File(fileStream, "text/csv", "customers.csv");
        }

        private string ConvertToCsv(List<CategoryDTO> categories)
        {
            var sb = new StringBuilder();
            // Use semicolon as separator
            string separator = ";";

            // CSV Header with semicolon delimiter
            sb.AppendLine($"\"CategoryID\"{separator}\"Title\"{separator}\"Description\"{separator}\"CreatedAt\"");

            foreach (var category in categories)
            {
                // If the Country property is an object, you might need to extract a specific value (e.g., category.Country.Name)
                sb.AppendLine(
                    $"\"{category.CategoryID}\"{separator}" +
                    $"\"{category.Title}\"{separator}" +
                    $"\"{category.Description}\"{separator}" +
                    $"\"{category.CreatedAt.ToShortDateString()}\""
                );
            }

            return sb.ToString();
        }










        [HttpGet("Selected", Name = "GetSelectedCategories")]
        // [Authorize(Roles = "Admin")] 
        [Authorize(Policy = "Admins")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<ActionResult<SearchDTO>> GetSelectedCategories()
        {
            IEnumerable<SearchDTO> Categories = await BussinessAccess.Category.GetSelectedCategories();
            if (Categories.Count() == 0)
                return NotFound("Categories not Found");
            else
                return Ok(new { data = Categories.ToList() });
        }



        [HttpDelete("Delete/{CategoryID}", Name = "DeleteCategory")]
        [Authorize(Policy = "Admins")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<ActionResult> DeleteCategory(int CategoryID)
        {
            try
            {
                if (await BussinessAccess.Category.DeleteCategory(CategoryID))
                    return Ok("Category is Deleted");
                else
                    return NotFound($"Category with ID : {CategoryID} does not deleted");
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }




        // [Authorize(Policy = "AgeGreaterThan25")]
        [HttpGet("Get/{CategoryID}", Name = "GetCategory")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [Authorize(Policy = "Admins")]
        public async Task<ActionResult<CategoryDTO>> GetCategory(int CategoryID)
        {
            try
            {
                var Category = await BussinessAccess.Category.FindCategoryByID(CategoryID);
                return Category.CategoryDTO;
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }

        }







        // [Authorize(Policy = "Admins")]
        [HttpPut("Update/{CategoryID}", Name = "UpdateCategory")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [AllowAnonymous]
        public async Task<ActionResult> UpdateCategory(int CategoryID, AddDTO CategoryDTO)
        {
            try
            {
                var Category = await BussinessAccess.Category.FindCategoryByID(CategoryID);
                if (Category == null)
                {
                    return NotFound($"Category with ID: {CategoryID} not found.");
                }

                Category.Title = CategoryDTO.Title;
                Category.Image = CategoryDTO.Image;
                Category.Description = CategoryDTO.Description;

                if (await Category.SaveAsync())
                    return Ok("Category is Updated");
                else
                    return StatusCode(500, new { message = "Error Updating Category" });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }



        [HttpPost("Add", Name = "AddCategory")]
        [AllowAnonymous]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult> AddCategory(AddDTO categoryDTO)
        {
            try
            {
                Category category = new(categoryDTO, BussinessAccess.Category.EnMode.Add);
                if (await category.SaveAsync())
                {
                    return Created("Added Successfuly", new { Category = category.CategoryDTO });
                }
                else
                {
                    return StatusCode(500, "Error Adding Category");
                }
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }

        }

        [HttpGet("FilterByTitle", Name = "FilterTitle")]
        // [Authorize(Roles = "Admin")] 
        [Authorize(Policy = "Admins")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<ActionResult<IEnumerable<CategoryDTO>>> FilterTitle(string Tilte, int pageNumber, int LimitOfCategories)
        {
            IEnumerable<CategoryDTO> Categories = await BussinessAccess.Category.FilterCategoriesAsync(Tilte, pageNumber, LimitOfCategories);
            if (Categories.Count() == 0)
                return NotFound("Categories not Found");
            else
                return Ok(new { data = Categories.ToList() });
        }

    }
}