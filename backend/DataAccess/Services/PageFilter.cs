using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Azure;

namespace DataAccess.Services
{
    public class PageFilter
    {
        public int limitOfUsers { get; set; }
        public int pageNumber { get; set; }
        public PageFilter(int page, int users)
        {
            this.pageNumber = page;
            this.limitOfUsers = users;
        }
        public PageFilter()
        {
            this.pageNumber = -1;
            this.limitOfUsers = -1;
        }

    }
}