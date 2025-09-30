using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DataAccess.DTOS.Category
{
    public class CategoryDTO
    {
        public int CategoryID { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Image { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public CategoryDTO(int CategoryID, string Title, string Description, string Image, DateTime CreatedAt, DateTime UpdatedAt)
        {
            this.CategoryID = CategoryID;
            this.Title = Title;
            this.Description = Description;
            this.Image = Image;
            this.CreatedAt = CreatedAt;
            this.UpdatedAt = UpdatedAt;
        }
        public CategoryDTO()
        {
            this.CategoryID = CategoryID;
            this.Title = this.Description = this.Image = string.Empty;
            this.CreatedAt = this.UpdatedAt = DateTime.MaxValue;
        }
    }

}