import axios from "axios";
import Cookie from "cookie-universal";
const cookie = Cookie();
const Token = cookie.get("token");
export const AXIOS = axios.create({
  headers: {
    Authorization: `Bearer ${Token}`,
    Accept: "application/json",
  },


});
