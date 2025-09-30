using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DataAccess.Filters
{
    public class FilterType
    {
        public enum Product { ProductName, Rating, Price, Category }

        public enum OrderDetails { ProductName, UnitPrice, Discount }
        public enum Order { UserName, OrderStatus, OrderDate }
        public enum User { Email, UserName }
    }
}