using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DataAccess.DTOS.Country;
using DataAccess.Repositories.Country.Queries;

namespace DataAccess.Repositories.Country
{
    public class CountryRepositroy
    {
        public static async Task<IEnumerable<CountryDTO>> GetAllCountriesAsync()
        {
            return await GetAllCountriesQuery.ExcuteAsync();
        }

        public static async Task<CountryDTO> GetCountryByIDAsync(int CountryID)
        {
            return await GetCountryByIDQuery.ExcuteAsync(CountryID);
        }
        public static async Task<CountryDTO> GetCountryByNameAsync(string CountryName)
        {
            return await GetCountryByNameQuery.ExcuteAsync(CountryName);
        }

    }
}