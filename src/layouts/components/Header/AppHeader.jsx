import React, { useEffect, useState } from "react";
import { useHeaderStore } from "../../../store/Header/useHeaderStore";
import BreadCrumbs from "./BreadCrumbs";
import { useAppStore } from "../../../store/app.store";
import SwitchField from "../../../components/ui/SwitchField";
import useAgentStore from "../../../store/Agent/useAgentStore";
const ClockStatus = ({ isClockedIn }) => {
    const isIn = !!isClockedIn;

    return (
        <div
            className={`
                flex items-center gap-2
                px-3 py-1.5
                rounded-full
                border
                text-sm font-medium
                transition-all duration-200
                ${
                    isIn
                        ? "bg-green-50 border-green-200 text-green-700"
                        : "bg-red-50 border-red-200 text-red-600"
                }
            `}
        >
            <span
                className={`
                    flex items-center justify-center
                    w-3 h-3 rounded-full bg-green-500 animate-pulse
                    ${isIn ? "bg-green-500" : "bg-red-500"}
                `}
            >
                <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
            </span>

            <span className="text-[10px] sm:text-[14px]">
                {isIn ? "Clocked In" : "Clocked Out"}
            </span>
        </div>
    );
};
const AppHeader = () => {
    const { title, actions } = useHeaderStore();
    const { userDetails } = useAppStore()?.userDetails || {};
    const checkBreak = userDetails?.activity?.status === "break_in";

    const [isBreakOn, setIsBreak] = useState(false);

    useEffect(() => {
        setIsBreak(checkBreak);
    }, [checkBreak]);
    const { updateUser } = useAgentStore();

    const handleBreakChange = (v) => {
        setIsBreak(v);
        //setCookie("isBreak", v);
        updateUser(userDetails.userId, { activityStatus: v ? "break_in" : "available" }, () => {
            window.location.reload();
        });
    };
    const renderButtons = () => {
        if (typeof actions === "function") {
            return actions();
        }
        return actions;
    };

    return (
        <div className="flex flex-col gap-3 px-4 md:px-6 pt-5 pb-3 bg-white">
            <div className="flex flex-wrap gap-4 items-center justify-between border-b border-gray-200">
                <div>
                    {title && (
                        <h1 className="text-[26px] text-primary-black-15 font-medium">{title}</h1>
                    )}
                    <BreadCrumbs />
                </div>

                <div className="flex flex-wrap items-center gap-3 sm:justify-end">
                    {!isBreakOn && userDetails?.appUserType === "agent" && (
                        <div className="z-20 flex items-center gap-2 -mt-4">
                            <div className="text-[#0F172B] text-[15px]">
                                {isBreakOn ? "Break In" : "Break Out"}
                            </div>
                            <div>
                                <SwitchField
                                    name=""
                                    enabled={
                                        isBreakOn ||
                                        userDetails?.userDetails?.activity?.status === "break_in"
                                    }
                                    setEnabled={(v) => handleBreakChange(v)}
                                />
                            </div>
                        </div>
                    )}
                    <div className="-mt-4 flex flex-wrap gap-3">
                        {userDetails?.appUserType === "agent" && (
                            <ClockStatus
                                isClockedIn={userDetails?.is_currently_clocked_in || true}
                            />
                        )}

                        {renderButtons()}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default AppHeader;
