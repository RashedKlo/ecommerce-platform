using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Api.models
{
    public class JwtOptions
    {
        public required string Issuer { get; set; } = string.Empty;
        public required string Audience { get; set; } = string.Empty;
        public TimeSpan Lifetime { get; set; }
        public required string SigningKey { get; set; } = string.Empty;
    }
}