import { Navigate, Outlet, useLocation } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import useLoginStore from "../store/Login/useLoginStore";
import { useAppStore } from "../store/app.store";

export default function PrivateRoute() {
    const authChecked = useLoginStore((state) => state.authChecked);
    const userDetailsData = useAppStore((state) => state.userDetails);
    const location = useLocation();

    const { menuPermissions = [] } = userDetailsData || {};
    const firstMenuPath = menuPermissions?.[0]?.childMenus?.[0]?.webPathUrl;
    const defaultPaths = [
        "/profile",
        "/login-activities",
        "/doc-configuration",
        "/device-history",
        "/create-shift",
        "/access-forbidden",
        "/users/users-list",
        "/users/user-list/edit-user",
        "/users/users-list/create-user",
        "/roles/roles-list",
        "/roles/role-list/create-role",
        "/roles/role-list/edit-role/",
        "/clients-list/create-client",
        "/clients-list/edit-client",
        "/designations/designations-list",
        "/departments/department-list"
    ];
    const allowedPaths = [
        ...defaultPaths,
        ...(menuPermissions?.flatMap((menu) =>
            Array.isArray(menu.webPathUrl)
                ? menu.webPathUrl
                : menu.webPathUrl
                  ? [menu.webPathUrl]
                  : []
        ) || []),
    ];

    if (!authChecked) {
        return <Navigate to="/signin" replace />;
    }

    if (location.pathname === "/" && firstMenuPath) {
        return <Navigate to={firstMenuPath} replace />;
    }
    const hasAccess = allowedPaths.some(
        (path) => location.pathname === path || location.pathname.startsWith(path + "/")
    );
    if (!hasAccess || !menuPermissions.length) {
        return <Navigate to="/access-forbidden" replace />;
    }

    return (
        <MainLayout>
            <Outlet />
        </MainLayout>
    );
}
