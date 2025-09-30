import { Navigate, Outlet } from "react-router-dom";
import Cookie from 'cookie-universal';
import Page404 from "../Component/Placeholder/Page404";

export default function RequireAuth({ role }) {
    const cookie = Cookie();
    const token = cookie.get("token");
    const reftoken = cookie.get("reftoken");
    const currentUser = cookie.get("currentUser");
    const isAuthenticated = token && reftoken && currentUser != null;
    if (isAuthenticated) {

        if (role.includes(currentUser?.role.toLowerCase()))
            return <Outlet />;
        else
            return <Page404 />

    }
    else
        return <Navigate to={"/login"} />;
};