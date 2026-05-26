import { Navigate, Outlet } from "react-router-dom";
import { useAppStore } from "../store/app.store";
import useLoginStore from "../store/Login/useLoginStore";
import AuthLayout from "../pages/Login/Content/AuthLayout";
import MainLayout from "../layouts/MainLayout";
export default function PublicRoute() {
    const isAuthenticated = useLoginStore((state) => state.authChecked);
    const forcePasswordChange = useLoginStore((s) => s.forcePasswordChange);
    const userDetails = useAppStore((state) => state.userDetails);

    const firstMenuPath = userDetails?.menuPermissions?.[0]?.childMenus?.[0]?.webPathUrl;

    if (isAuthenticated && forcePasswordChange) {
        return <MainLayout />;
    }

    if (isAuthenticated && !firstMenuPath) {
        return null;
    }

    if (isAuthenticated && firstMenuPath) {
        return <Navigate to={firstMenuPath} replace />;
    }

    return (
        <AuthLayout>
            <Outlet />
        </AuthLayout>
    );
}
