using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DataAccess.DTOS.RefreshToken
{
    public class RefreshTokenDTO
    {

        public int ID { get; set; }
        public int UserID { get; set; }
        public string Token { get; set; } = string.Empty;
        public DateTime TokenCreated { get; set; }
        public DateTime Expires { get; set; }
        public bool IsRevoked { get; set; }
        public RefreshTokenDTO(int ID, int UserID, string Token, DateTime TokenCreated, DateTime Expires, bool IsRevoked)
        {
            this.ID = ID;
            this.UserID = UserID;
            this.Token = Token;
            this.Expires = Expires;
            this.IsRevoked = IsRevoked;
            this.TokenCreated = TokenCreated;
        }
        public RefreshTokenDTO()
        {
            this.ID = -1;
            this.UserID = -1;
            this.Token = string.Empty;
            this.Expires = new DateTime();
            this.IsRevoked = false;
            this.TokenCreated = new DateTime();
        }
    }

}