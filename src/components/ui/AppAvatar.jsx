import { FC } from "react";
import ImageLoader from "./ImageLoader";

export const AppAvatar = ({ imgSrc = "", initials = "", insideClassName = "", className = "" }) => {
    if (imgSrc) {
        return (
            <div className={`flex items-center justify-center ${className}`}>
                <ImageLoader imageKey={imgSrc} className="w-7 h-7 object-contain" />
            </div>
        );
    }

    return (
        <div className={`flex items-center justify-center rounded-full font-bold ${className}`}>
            <div className={insideClassName}>{initials}</div>
        </div>
    );
};
