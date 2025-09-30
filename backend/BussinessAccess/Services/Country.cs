using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DataAccess;
using DataAccess.DTOS.Country;
using DataAccess.Repositories.Country;

namespace BussinessAccess
{
    public class Country
    {
        public int CountryID { get; set; }
        public string CountryName { get; set; }
        public Country(CountryDTO countryDTO)
        {
            this.CountryName = countryDTO.Country;
            this.CountryID = countryDTO.CountryID;
        }
        public CountryDTO CountryDTO
        {
            get
            {
                return new(CountryID, CountryName);
            }
        }
        async static public Task<Country> GetCountryByID(int CountryID)
        {
            if (CountryID <= 0)
            {
                throw new InvalidOperationException("CountryID not valid");
            }
            CountryDTO CountryDTO = await CountryRepositroy.GetCountryByIDAsync(CountryID);
            if (CountryDTO.CountryID == -1)
            {
                throw new InvalidOperationException("Country not found");
            }
            else
                return new Country(CountryDTO);
        }
        async static public Task<Country?> GetCountryByName(string CountryName)
        {
            if (string.IsNullOrEmpty(CountryName))
            {
                throw new InvalidOperationException("CountryName not valid");
            }
            CountryDTO CountryDTO = await CountryRepositroy.GetCountryByNameAsync(CountryName);
            if (CountryDTO.CountryID == -1)
            {
                throw new InvalidOperationException("Country not found");
            }
            else
                return new Country(CountryDTO);
        }

        async static public Task<IEnumerable<CountryDTO>> GetCountries()
        {

            return await CountryRepositroy.GetAllCountriesAsync();

        }

    }
}