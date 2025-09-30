using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DataAccess.DTOS.Category;
using DataAccess.Repositories.Category.Commands;
using DataAccess.Repositories.Category.Queries;
using DataAccess.Services;

namespace DataAccess.Repositories.Category
{
    public class CategoryRepository
    {
        public static async Task<int> AddCategoryAsync(AddDTO addDTO)
        {
            return await AddCategoryCommand.ExcuteAsync(addDTO);
        }
        public async static Task<bool> DeleteCategoryAsync(int ID)
        {
            return await DeleteCategoryCommand.ExcuteAsync(ID);
        }
        public static async Task<bool> UpdateCategoryAsync(AddDTO categroy, int CategoryID)
        {
            return await UpdateCategoryCommand.ExcuteAsync(categroy, CategoryID);
        }
        public static async Task<IEnumerable<CategoryDTO>> GetAllCategoriesAsync(PageFilter page)
        {
            return await GetAllCategoriesQuery.ExcuteAsyn(page);
        }
        public static async Task<IEnumerable<CategoryDTO>> GetCategoriesByFilterAsync(ValueFilter valueFilter)
        {
            return await GetCategoriesByFilterQuery.ExcuteAsync(valueFilter);
        }
        public static async Task<CategoryDTO> GetCategoryByIDAsync(int CategoryID)
        {
            return await GetCategoryByIDQuery.ExcuteAsync(CategoryID);
        }
        public static async Task<bool> IsCategoryIDExistedAsync(int CategoryID)
        {
            return await IsCategoryIDExistedQuery.ExcuteAsync(CategoryID);
        }
        public static async Task<IEnumerable<SearchDTO>> GetSearchCategoriesAsync()
        {
            return await GetSearchCategoriesQuery.ExcuteAsync();
        }
        public static async Task<bool> IsCategoryTitleExistedAsync(string Title)
        {
            return await IsCategoryTitleExistedQuery.ExcuteAsync(Title);
        }
    }
}