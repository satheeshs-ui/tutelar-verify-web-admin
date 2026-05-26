import { useState, useRef, useEffect, useMemo, startTransition } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import * as Motion from "framer-motion";
import * as Icons from "lucide-react";
import { useAppStore } from "../../../store/app.store";
import userProfileStore from "../../../store/UserProfile/userProfileStore";
import ImageLoader from "../../../components/ui/ImageLoader";
import { MENU_ICON_MAP, shortName } from "../../../utils";
import CustomPopover from "../../../components/ui/CustomPopover";

export default function Sidebar() {
    const { userDetails } = useAppStore();

    const [profileOpen, setProfileOpen] = useState(false);
    const [activeSubmenu, setActiveSubmenu] = useState(null);
    const [activeChildSubmenu, setActiveChildSubmenu] = useState(null);

    const navigate = useNavigate();
    const location = useLocation();
    const [btnLoading, setBtnLoading] = useState(false);
    const isProfileRouteActive = (path) => location.pathname === path;

    const sidebarRef = useRef(null);
    const profileRef = useRef(null);

    const dynamicMenus = useMemo(() => {
        const menus = [...(userDetails?.menuPermissions || [])];

        return [...menus].sort((a, b) => a.sortOrder - b.sortOrder);
    }, [userDetails?.menuPermissions]);

    const routeMatchedMenu = useMemo(() => {
        const computeMatched = () => {
            for (const menu of dynamicMenus) {
                for (const child of menu?.childMenus || []) {
                    if (
                        child?.webPathUrl &&
                        child?.webPathUrl !== "/" &&
                        location.pathname?.startsWith(child?.webPathUrl)
                    ) {
                        return {
                            parentKey: menu?.menuName,
                            childKey: child?.id || child?.menuName,
                            subChildKey: null,
                        };
                    }

                    for (const subChild of child?.subChildMenus || []) {
                        if (
                            subChild?.webPathUrl &&
                            location.pathname?.startsWith(subChild?.webPathUrl)
                        ) {
                            return {
                                parentKey: menu?.menuName,
                                childKey: child?.id || child?.menuName,
                                subChildKey: subChild?.id || subChild?.menuName,
                            };
                        }
                    }
                }
            }

            return {
                parentKey: null,
                childKey: null,
                subChildKey: null,
            };
        };

        return computeMatched();
    }, [dynamicMenus, location.pathname]);

    useEffect(() => {
        if (routeMatchedMenu?.parentKey) {
            startTransition(() => {
                setActiveSubmenu(routeMatchedMenu.parentKey);
            });
        }
        if (routeMatchedMenu?.childKey) {
            startTransition(() => {
                setActiveChildSubmenu(routeMatchedMenu.childKey);
            });
        }
    }, [routeMatchedMenu]);

    useEffect(() => {
        const handlePointerDown = (event) => {
            const sidebarEl = sidebarRef.current;
            const profileEl = profileRef.current;

            if (!sidebarEl) return;

            if (!sidebarEl.contains(event.target)) {
                setActiveSubmenu(null);
                setActiveChildSubmenu(null);
            }

            if (profileEl && !profileEl.contains(event.target)) {
                setProfileOpen(false);
            }
        };

        document.addEventListener("pointerdown", handlePointerDown);

        return () => {
            document.removeEventListener("pointerdown", handlePointerDown);
        };
    }, []);

    const handleParentClick = (menu) => {
        const parentKey = menu?.menuName;

        if (menu?.childMenus?.length === 1) {
            const firstChild = menu?.childMenus?.[0];

            if (firstChild?.subChildMenus?.length > 0) {
                // setActiveSubmenu((prev) => (prev === parentKey ? null : parentKey));
                setActiveSubmenu(parentKey);
                setActiveChildSubmenu(firstChild?.id || firstChild?.menuName);
                return;
            }

            navigate(firstChild?.webPathUrl);
            return;
        }

        // setActiveSubmenu((prev) => (prev === parentKey ? null : parentKey));
        setActiveSubmenu(parentKey);
        setActiveChildSubmenu(null);
    };

    const handleChildMenuClick = (child) => {
        const childKey = child?.id || child?.menuName;

        if (child?.subChildMenus?.length > 0) {
            setActiveChildSubmenu((prev) => (prev === childKey ? null : childKey));
            return;
        }

        navigate(child?.webPathUrl);
    };

    const handleChildClick = (path) => {
        navigate(path);
    };

    return (
        <aside
            ref={sidebarRef}
            className="h-full w-[88px] rounded-2xl bg-sidebar flex flex-col justify-between py-3 z-9999 relative overflow-visible"
        >
            <div className="flex flex-col items-center w-full overflow-hidden">
                <ImageLoader imageKey="tutIconIcon" className="w-10 h-10" />
                <div className="h-px w-12 bg-white/24 my-4"></div>

                <div className="w-full flex flex-col items-center space-y-4 overflow-y-auto relative">
                    {dynamicMenus.map((menu, i) => {
                        const parentKey = menu?.menuName;
                        const isOpen = activeSubmenu === parentKey;

                        const isRouteActive = routeMatchedMenu?.parentKey === parentKey;
                        const isParentActive = isRouteActive || isOpen;

                        const iconConfig = MENU_ICON_MAP[menu.menuName] || {};
                        const iconKey = isParentActive ? iconConfig.active : iconConfig.inactive;

                        const openSubmenu = isOpen && menu?.childMenus?.length > 1;

                        return (
                            <div
                                key={`${menu.menuName}-${i}`}
                                className="relative w-full flex flex-col items-center"
                            >
                                <CustomPopover
                                    trigger={
                                        <div className="relative w-full flex flex-col items-center">
                                            <div
                                                onClick={() => handleParentClick(menu)}
                                                className="flex flex-col items-center justify-center w-full cursor-pointer group transition relative"
                                            >
                                                <div
                                                    className={`flex items-center justify-center p-1.5 rounded-md transition-all duration-200 ${
                                                        isParentActive
                                                            ? "bg-primary shadow-lg"
                                                            : "group-hover:bg-white/10"
                                                    }`}
                                                >
                                                    <ImageLoader
                                                        imageKey={iconKey}
                                                        className={`w-5 h-5 transition-transform duration-200 ${isParentActive ? "" : "filter-[brightness(0)_invert(1)_opacity(0.5)]"}`}
                                                    />
                                                </div>

                                                <span
                                                    className={`2xl:text-base text-[10px] sm:text-xs overall-sidebar-text font-medium text-center leading-tight mt-1.5 ${
                                                        isParentActive
                                                            ? "text-white"
                                                            : "text-white/50"
                                                    }`}
                                                >
                                                    {menu.menuName}
                                                </span>
                                            </div>
                                        </div>
                                    }
                                >
                                    <div className="z-9999999">
                                        <Motion.AnimatePresence>
                                            {openSubmenu && (
                                                <Motion.motion.div
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: -10 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="absolute left-[90px] -top-20 min-w-[200px] min-h-[10vh] overflow-y-auto backdrop-blur-xl bg-white border border-gray-200 shadow-xl rounded-xl p-2 z-99999"
                                                >
                                                    {menu?.childMenus
                                                        ?.sort((a, b) => a.sortOrder - b.sortOrder)
                                                        ?.map((child, childIndex) => {
                                                            const childKey =
                                                                child?.id || child?.menuName;
                                                            const hasSubChild =
                                                                child?.subChildMenus?.length > 0;

                                                            const isChildOpen =
                                                                activeChildSubmenu === childKey;

                                                            const isChildActive =
                                                                routeMatchedMenu?.childKey ===
                                                                    childKey ||
                                                                (child?.webPathUrl &&
                                                                    location.pathname.startsWith(
                                                                        child.webPathUrl
                                                                    ));

                                                            // const childIconConfig =
                                                            //     MENU_ICON_MAP[menu.menuName]
                                                            //         ?.children?.[
                                                            //         child.menuName
                                                            //     ] || {};

                                                            // const childIconKey =
                                                            //     isChildActive
                                                            //         ? childIconConfig.active
                                                            //         : childIconConfig.inactive;

                                                            return (
                                                                <div
                                                                    key={`${childKey}-${childIndex}`}
                                                                    className="mb-1"
                                                                >
                                                                    <div
                                                                        onClick={() => {
                                                                            handleChildMenuClick(
                                                                                child
                                                                            );
                                                                            // closePopover();
                                                                        }}
                                                                        className={`flex items-center justify-between gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all ${
                                                                            isChildActive
                                                                                ? "bg-[#0f6f79]/10 font-semibold"
                                                                                : "hover:bg-gray-100"
                                                                        }`}
                                                                    >
                                                                        <div className="flex items-center gap-3">
                                                                            {/* <ImageLoader
                                                                                        imageKey={
                                                                                            childIconKey
                                                                                        }
                                                                                        className={`w-5 h-5 ${
                                                                                            isChildActive
                                                                                                ? "opacity-100"
                                                                                                : "opacity-70"
                                                                                        }`}
                                                                                    /> */}
                                                                            <span
                                                                                className={`text-sm ${
                                                                                    isChildActive
                                                                                        ? "text-[#0f6f79] font-medium"
                                                                                        : "text-gray-700"
                                                                                }`}
                                                                            >
                                                                                {child.menuName}
                                                                            </span>
                                                                        </div>

                                                                        {hasSubChild && (
                                                                            <Icons.ChevronRight
                                                                                size={16}
                                                                                className={`transition-transform ${
                                                                                    isChildOpen
                                                                                        ? "rotate-90"
                                                                                        : ""
                                                                                }`}
                                                                            />
                                                                        )}
                                                                    </div>

                                                                    {hasSubChild && isChildOpen && (
                                                                        <div className="ml-4 mt-1 border-l border-gray-200 pl-3 space-y-1">
                                                                            {child?.subChildMenus
                                                                                ?.sort(
                                                                                    (a, b) =>
                                                                                        a.sortOrder -
                                                                                        b.sortOrder
                                                                                )
                                                                                ?.map(
                                                                                    (
                                                                                        subChild,
                                                                                        subIndex
                                                                                    ) => {
                                                                                        const isSubChildActive =
                                                                                            location.pathname.startsWith(
                                                                                                subChild.webPathUrl
                                                                                            );

                                                                                        return (
                                                                                            <div
                                                                                                key={`${subChild.id}-${subIndex}`}
                                                                                                onClick={() => {
                                                                                                    handleChildClick(
                                                                                                        subChild.webPathUrl
                                                                                                    );
                                                                                                    // closePopover();
                                                                                                }}
                                                                                                className={`px-3 py-2 rounded-md cursor-pointer text-sm transition-all ${
                                                                                                    isSubChildActive
                                                                                                        ? "bg-[#0f6f79]/10 text-[#0f6f79] font-medium"
                                                                                                        : "text-gray-600 hover:bg-gray-100"
                                                                                                }`}
                                                                                            >
                                                                                                {
                                                                                                    subChild.menuName
                                                                                                }
                                                                                            </div>
                                                                                        );
                                                                                    }
                                                                                )}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            );
                                                        })}
                                                </Motion.motion.div>
                                            )}
                                        </Motion.AnimatePresence>
                                    </div>
                                </CustomPopover>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div ref={profileRef} className="flex flex-col items-center mb-2 relative">
                <div>
                    <ImageLoader imageKey={"vknotification"} />
                </div>
                <div className="h-px w-12 bg-white/24 my-4"></div>

                <div
                    className="w-13 h-13 text-[#18667C] text-center flex justify-center items-center text-[18px] font-medium rounded-full cursor-pointer border-2 border-[#D1E0E5] bg-white"
                    onClick={() => setProfileOpen((prev) => !prev)}
                >
                    {shortName(userDetails?.userDetails?.name || "User")}
                </div>

                <Motion.AnimatePresence>
                    {profileOpen && (
                        <Motion.motion.div
                            initial={{ opacity: 0, y: 15, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 15, scale: 0.98 }}
                            transition={{ duration: 0.2 }}
                            className="absolute left-[100px] bottom-0 w-[300px]
            bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)]
            border border-gray-100 overflow-hidden z-50"
                        >
                            <div className="px-5 py-4 flex items-center gap-2 border-b border-gray-200">
                                <div className="w-13 h-13 text-[#18667C] text-center flex justify-center items-center text-[18px] font-medium rounded-full cursor-pointer border-2 border-[#D1E0E5] bg-white">
                                    {shortName(userDetails?.userDetails?.name || "User")}
                                </div>
                                <div className="mt-2">
                                    <p className="text-[16px] text-[#0B1C20] font-medium capitalize mb-1!">
                                        {userDetails?.userDetails?.name || "User"}
                                    </p>
                                    <p className="text-sm text-[#394245] font-normal">
                                        {userDetails?.userDetails?.email || "-"}
                                    </p>
                                </div>
                            </div>

                            <div className="p-2">
                                <div
                                    onClick={() => navigate("/profile")}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 cursor-pointer transition ${
                                        isProfileRouteActive("/profile")
                                            ? "bg-linear-to-r from-[#0f6f79]/20 to-transparent font-semibold"
                                            : ""
                                    }`}
                                >
                                    <Icons.User size={18} className="text-[#0f6f79]" />
                                    <span className="text-sm text-gray-700">Profile Settings</span>
                                </div>
                                {userDetails?.userDetails?.appUserType === "client" && (
                                    <div
                                        onClick={() => navigate("/doc-configuration")}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 cursor-pointer transition ${
                                            isProfileRouteActive("/doc-configuration")
                                                ? "bg-linear-to-r from-[#0f6f79]/20 to-transparent font-semibold"
                                                : ""
                                        }`}
                                    >
                                        <ImageLoader
                                            imageKey="docsConfig"
                                            className="w-5 h-5"
                                            style={{
                                                filter: "brightness(0) saturate(100%) invert(31%) sepia(32%) saturate(1016%) hue-rotate(138deg) brightness(93%) contrast(91%)",
                                            }}
                                        />
                                        <span className="text-sm text-gray-700">
                                            Doc configuration
                                        </span>
                                    </div>
                                )}

                                <div
                                    onClick={() => navigate("/login-activities")}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 cursor-pointer transition ${
                                        isProfileRouteActive("/login-activities")
                                            ? "bg-linear-to-r from-[#0f6f79]/20 to-transparent font-semibold"
                                            : ""
                                    }`}
                                >
                                    <Icons.Activity size={18} className="text-[#0f6f79]" />
                                    <span className="text-sm text-gray-700">Login Activities</span>
                                </div>

                                <div
                                    onClick={() => navigate("/device-history")}
                                    className={`flex items-center gap-3 px-4 py-3 mb-3 rounded-xl hover:bg-gray-100 cursor-pointer transition ${
                                        isProfileRouteActive("/device-history")
                                            ? "bg-linear-to-r from-[#0f6f79]/20 to-transparent font-semibold"
                                            : ""
                                    }`}
                                >
                                    <Icons.Monitor size={18} className="text-[#0f6f79]" />
                                    <span className="text-sm text-gray-700">Device History</span>
                                </div>

                                <p className="border-b border-gray-200"></p>

                                <div className="flex justify-between items-center gap-3 px-4 py-3 rounded-xl text-gray-500 mt-2">
                                    <div className="flex items-center gap-2">
                                        <ImageLoader imageKey="versionIcon" className="w-5 h-5" />
                                        <span className="text-[#394245] text-[12px]">
                                            App Version
                                        </span>
                                    </div>
                                    <span className="text-[#394245] text-[12px]">0.0.2</span>
                                </div>

                                <div
                                    onClick={() => {
                                        setBtnLoading(true);
                                        userProfileStore.getState().logoutUser();
                                    }}
                                    className="cursor-pointer border border-[#F04438] flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 transition text-center justify-center mt-2"
                                >
                                    <ImageLoader imageKey="userLogoutIcon" className="w-5 h-5" />
                                    <span className="text-sm text-red-600">
                                        {btnLoading ? "Logging out..." : "Logout"}
                                    </span>
                                </div>
                            </div>
                        </Motion.motion.div>
                    )}
                </Motion.AnimatePresence>
            </div>
        </aside>
    );
}
