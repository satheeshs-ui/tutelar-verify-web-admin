import { useLocation, useNavigate } from "react-router-dom";
import React, { useCallback, useEffect, useState } from "react";
import { useAppStore } from "../../../store/app.store";
import ImageLoader from "../../../components/ui/ImageLoader";
import { capitalizeFirstLetter, removeUnderScore } from "../../../utils";

const BreadCrumbs = () => {
    const [filteredParts, setFilteredParts] = useState([]);
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const userDetails = useAppStore((state) => state.userDetails);

    const handlePathnameLogic = useCallback((path) => {
        const parts = path.split("/").filter(Boolean);

        const isIdLike = (segment) => {
            const hasMixedCase = /[a-z]/.test(segment) && /[A-Z]/.test(segment);

            return (
                /^\d+$/.test(segment) ||
                /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
                    segment
                ) ||
                /^[0-9a-f]{24}$/.test(segment) ||
                /^[a-zA-Z0-9_-]{20,}$/.test(segment) ||
                (/^[a-zA-Z0-9]{8,}$/.test(segment) && hasMixedCase)
            );
        };

        const filtered = parts.filter((part) => part !== part.toUpperCase() && !isIdLike(part));

        setFilteredParts(filtered);
    }, []);

    useEffect(() => {
        if (!pathname) return;

        Promise.resolve().then(() => {
            handlePathnameLogic(pathname);
        });
    }, [pathname, handlePathnameLogic]);

    const handleNavigate = () => {
        const path = pathname.split("/");

        // const navigatePath = filteredParts.slice(0, index + 1).join("/");
        navigate(`/${path[1]}/${path[2]}`);
        // navigate(-1);
    };

    const getDisplayName = (segment) => {
        return removeUnderScore(capitalizeFirstLetter(segment));
    };
    const firstMenuPath = userDetails?.menuPermissions?.[0]?.childMenus?.[0]?.webPathUrl;

    return (
        <div className="w-full flex justify-between items-center">
            <div className="flex items-center">
                <ul className="flex items-center">
                    <li
                        className="flex items-center text-base font-medium text-primary-grey-1 cursor-pointer"
                        onClick={() => navigate(firstMenuPath)}
                    >
                        <ImageLoader imageKey="Homeicons" className="w-4 h-4 mr-2" />
                        <span>Home</span>
                    </li>

                    {filteredParts.length > 0 && (
                        <li>
                            <ImageLoader imageKey="BreadCrumbArrow" className="w-4 h-4 mx-1" />
                        </li>
                    )}

                    {filteredParts.map((segment, index) => {
                        const isLast = index === filteredParts.length - 1;
                        const displayName = getDisplayName(segment);

                        const isAction = ["create", "edit", "add"].includes(segment);
                        const isClickable = !isLast && !isAction;

                        return (
                            <React.Fragment key={segment + index}>
                                <li
                                    onClick={isClickable ? () => handleNavigate() : undefined}
                                    className={`flex items-center sm:text-base text-[10px] ${
                                        isLast
                                            ? "text-breadcrumb font-bold"
                                            : isClickable
                                              ? "cursor-pointer text-primary-grey-1 font-medium"
                                              : "text-primary-grey-1 font-medium"
                                    }`}
                                >
                                    {(filteredParts.length === 1 || index !== 0) && displayName}
                                </li>

                                {index !== 0 && !isLast && (
                                    <li>
                                        <ImageLoader
                                            imageKey="BreadCrumbArrow"
                                            className="w-4 h-4 mx-1"
                                        />
                                    </li>
                                )}
                            </React.Fragment>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
};

export default BreadCrumbs;
