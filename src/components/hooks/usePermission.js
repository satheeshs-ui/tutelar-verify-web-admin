import { useAppStore } from "../../store/app.store";
import { normalizePath } from "../../utils";
import { useLocation } from "react-router-dom";

export const usePermission = () => {
    const { userDetails } = useAppStore() || {};
    const location = useLocation();

    const getPermission = () => {
        if (!userDetails?.menuPermissions?.length) return [];

        const currentPath = location.pathname.split("/");

        for (const menu of userDetails.menuPermissions) {
            if (currentPath.includes(normalizePath(menu.webPathUrl))) {
                return menu.childMenus[0].permissions || {};
            }
        }

        return {};
    };

    return { getPermission };
};
