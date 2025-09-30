using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace BussinessAccess
{
    public class Validation
    {
        public static bool IsEmailValid(string Email)
        {
            string regex = @"^[^@\s]+@[^@\s]+.(com|net|org|gov)$";
            return Regex.IsMatch(Email, regex, RegexOptions.IgnoreCase);
        }
        public static bool IsPasswordValid(string Password)
        {
            return Password.Length >= 6;
        }
        public static bool IsBirthDateValid(DateTime date)
        {
            return date.CompareTo(DateTime.UtcNow) <= 0;
        }

    }
}