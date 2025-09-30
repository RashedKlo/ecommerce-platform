import { Outlet } from "react-router-dom";
import Cookie from "cookie-universal";

export default function RequireBack() {
  const cookie = Cookie();
  const token = cookie.get("token");
  const reftoken = cookie.get("reftoken");
  const currentUser = cookie.get("currentUser");
  const isAuthenticated = token && reftoken && currentUser != null;
  return !isAuthenticated ? <Outlet /> : window.history.back();
}
