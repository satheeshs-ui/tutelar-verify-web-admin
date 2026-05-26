import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

const PermissionDeniedModal = ({ title, description, instructions }) => {
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                e.preventDefault();
                e.stopPropagation();
            }
        };

        document.addEventListener("keydown", handleKeyDown, true);
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", handleKeyDown, true);
            document.body.style.overflow = "";
        };
    }, []);

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
            aria-modal="true"
            role="alertdialog"
        >
            <div className="bg-white rounded-xl w-[90%] max-w-md shadow-2xl overflow-hidden">
                {/* 🔴 Alert header */}
                <div className="flex items-center gap-3 bg-red-50 px-6 py-4 border-b border-red-200">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                    <h2 className="text-lg font-semibold text-red-700">{title}</h2>
                </div>

                {/* Content */}
                <div className="px-6 py-4 text-center">
                    <p className="text-gray-700 mb-4">{description}</p>

                    {instructions && <div className="text-sm text-gray-600">{instructions}</div>}
                </div>

                {/* Footer (no dismiss) */}
                <div className="bg-gray-50 px-6 py-3 text-xs text-gray-500 text-center">
                    This action is required to continue
                </div>
            </div>
        </div>
    );
};

export default PermissionDeniedModal;
