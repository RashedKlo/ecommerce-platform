using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DataAccess.DTOS.Country
{
    public class CountryDTO
    {
        public int CountryID { get; set; }
        public string Country { get; set; }
        public CountryDTO(int CountryID, string Country)
        {
            this.Country = Country;
            this.CountryID = CountryID;
        }
        public CountryDTO()
        {
            this.Country = string.Empty;
            this.CountryID = -1;
        }
    }
}