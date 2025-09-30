using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DataAccess.DTOS.Category
{
    public class SearchDTO(int CategoryID, string Title)
    {
        public int CategoryID { get; set; } = CategoryID;
        public string Title { get; set; } = Title;
    }
}