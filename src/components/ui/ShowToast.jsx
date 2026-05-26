import { toast } from "react-hot-toast";
import { AlertTriangle, Info } from "lucide-react";
import ImageLoader from "./ImageLoader";
import { AppAvatar } from "../ui/AppAvatar";

const TOAST_ID = "GLOBAL_SINGLETON_TOAST";

export const showToast = (type = "info", message = "") => {
    toast.remove(TOAST_ID);

    const icons = {
        success: (
            <AppAvatar imgSrc="showSuccessIcon" className="w-7 h-7 bg-[#ECFDF5] rounded-2xl p-1" />
        ),
        error: <AppAvatar imgSrc="closeIcon" className="w-7 h-7 bg-[#FFD9D9] rounded-2xl p-1" />,
        warning: <AlertTriangle size={16} className="text-yellow-500" />,
        info: <Info size={16} className="text-blue-500" />,
    };

    const borderColors = {
        success: "border-green-500",
        error: "border-red-500",
        warning: "border-yellow-500",
        info: "border-blue-500",
    };

    const formattedMessage =
        message?.length > 0 ? message.charAt(0).toUpperCase() + message.slice(1) : "";

    toast.custom(
        (t) => (
            <div
                className={`${
                    t.visible ? "animate-enter" : "animate-leave"
                } flex items-center justify-between w-100 p-3 rounded-xl shadow-lg bg-[#0F172A] border ${borderColors[type]}`}
            >
                <div className="flex items-center">
                    <div className="w-8 h-8 flex items-center justify-center mr-3">
                        {icons[type]}
                    </div>
                    <span className="text-sm font-semibold text-white">{formattedMessage}</span>
                </div>

                <button
                    onClick={() => toast.remove(TOAST_ID)}
                    className="ml-4 text-gray-400 hover:text-white cursor-pointer"
                    type="button"
                >
                    <ImageLoader
                        imageKey="closeIcon"
                        style={{ filter: "brightness(0) invert(1)" }}
                        className="w-5 h-5"
                    />
                </button>
            </div>
        ),
        {
            id: TOAST_ID,
            duration: 3000,
        }
    );
};
