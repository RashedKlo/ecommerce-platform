using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DataAccess.Services
{
    public class ValueFilter
    {
        public string value { get; set; } = string.Empty;
        public PageFilter page { get; set; } = new();
    }
}