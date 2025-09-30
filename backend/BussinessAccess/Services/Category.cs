using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DataAccess;
using DataAccess.DTOS.Category;
using DataAccess.Repositories.Category;
using DataAccess.Services;

namespace BussinessAccess
{
    public class Category
    {

        public enum EnMode { Add = 1, Update = 2 }
        public EnMode Mode = EnMode.Add;
        public int CategoryID { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Image { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public Category(AddDTO categoryDTO, EnMode mode)
        {
            Mode = mode;
            this.CategoryID = -1;
            this.Title = categoryDTO.Title;
            this.Description = categoryDTO.Description;
            this.Image = categoryDTO.Image;
            this.CreatedAt = this.UpdatedAt = DateTime.UtcNow;
        }
        public Category(CategoryDTO categoryDTO, EnMode mode)
        {
            Mode = mode;
            this.CategoryID = categoryDTO.CategoryID;
            this.Title = categoryDTO.Title;
            this.Description = categoryDTO.Description;
            this.Image = categoryDTO.Image;
            this.CreatedAt = categoryDTO.CreatedAt;
            this.UpdatedAt = categoryDTO.UpdatedAt;
        }
        public Category()
        {
            this.CategoryID = CategoryID;
            this.Title = this.Description = this.Image = string.Empty;
            this.CreatedAt = this.UpdatedAt = DateTime.MaxValue;
        }
        public CategoryDTO CategoryDTO
        {
            get
            {
                return new CategoryDTO(CategoryID, Title, Description, Image, CreatedAt, UpdatedAt);
            }
        }

        public AddDTO AddCategoryDTO
        {
            get
            {
                return new AddDTO
                {
                    Title = Title,
                    Description = Description,
                    Image = Image,
                };
            }
        }
        public static async Task<Category> FindCategoryByID(int CategoryID)
        {
            if (CategoryID <= 0)
            {
                throw new InvalidOperationException("CategoryID not valid");
            }
            CategoryDTO CategoryDTO = await CategoryRepository.GetCategoryByIDAsync(CategoryID);
            if (CategoryDTO.CategoryID == -1)
            {
                throw new InvalidOperationException("Category not found");
            }
            else
                return new Category(CategoryDTO, EnMode.Update);
        }

        private async Task<bool> _AddCategoryAsync()
        {
            if (await IsCategoryExistByTitle(AddCategoryDTO.Title))
            {
                throw new InvalidOperationException("Title has been taken");
            }
            this.CategoryID = await CategoryRepository.AddCategoryAsync(AddCategoryDTO);
            if (this.CategoryID == -1)
            {
                throw new InvalidOperationException("Error adding Product");
            }
            return this.CategoryID != -1;

        }
        private async Task<bool> _UpdateCategory()
        {

            return await CategoryRepository.UpdateCategoryAsync(AddCategoryDTO, CategoryID);
        }
        public async Task<bool> SaveAsync()
        {
            switch (Mode)
            {
                case EnMode.Add:
                    if (await _AddCategoryAsync())
                    {
                        Mode = EnMode.Update;
                        return true;
                    }
                    return false;
                case EnMode.Update:
                    return await _UpdateCategory();
                default:
                    return false;
            }
        }
        public static async Task<bool> IsCategoryExistByID(int CategoryID)
        {
            if (CategoryID < 1)
            {
                throw new InvalidOperationException("CategoryID not Valid");
            }
            return await CategoryRepository.IsCategoryIDExistedAsync(CategoryID);
        }
        public static async Task<bool> IsCategoryExistByTitle(string Title)
        {
            if (string.IsNullOrEmpty(Title) || Title.Length <= 3)
            {
                throw new InvalidOperationException("Title not Valid");
            }
            return await CategoryRepository.IsCategoryTitleExistedAsync(Title);
        }
        public static async Task<bool> DeleteCategory(int CategoryID)
        {
            if (CategoryID < 1)
            {
                throw new InvalidOperationException("Category ID not Valid");
            }
            return await CategoryRepository.DeleteCategoryAsync(CategoryID);
        }
        public static async Task<IEnumerable<CategoryDTO>> GetCategoriesAsync(int pageNumber, int LimitOfCategories)
        {
            if (pageNumber < 0)
            {
                pageNumber = 1;
            }
            if (LimitOfCategories < 0)
            {
                pageNumber = 1;
            }
            return await CategoryRepository.GetAllCategoriesAsync(new DataAccess.Services.PageFilter(pageNumber, LimitOfCategories));
        }
        public static async Task<IEnumerable<SearchDTO>> GetSelectedCategories()
        {
            return await CategoryRepository.GetSearchCategoriesAsync();
        }

        public static async Task<IEnumerable<CategoryDTO>> FilterCategoriesAsync(string Title, int pageNumber, int LimitOfCategories)
        {
            if (pageNumber < 0)
            {
                pageNumber = 1;
            }
            if (LimitOfCategories < 0)
            {
                pageNumber = 1;
            }
            if (string.IsNullOrEmpty(Title))
            {
                throw new InvalidOperationException("Title not Valid");
            }
            return await CategoryRepository.GetCategoriesByFilterAsync(new ValueFilter { value = Title, page = new PageFilter(pageNumber, LimitOfCategories) });
        }



    }

}
