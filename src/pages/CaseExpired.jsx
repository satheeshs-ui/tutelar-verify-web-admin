import React from "react";
import { ClockAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CaseExpiredPage = () => {
    const navigate = useNavigate();

    const handleClose = () => {
        if (window.opener) {
            window.opener.postMessage("CASE_EXPIRED", "*");
            window.close();
        } else {
            navigate("/case-bucket");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 text-center">
                {/* Icon */}
                <div className="flex justify-center mb-6">
                    <ClockAlert className="w-16 h-16 text-amber-500" />
                </div>

                <h2 className="text-xl font-semibold text-gray-900 mb-3">Case Expired</h2>

                <p className="text-gray-600 text-sm leading-relaxed mb-8">
                    The verification window for this case has expired. This session is no longer
                    active and cannot be accessed. Please return to the dashboard to continue with
                    other assigned cases.
                </p>

                <button
                    onClick={handleClose}
                    className="cursor-pointer w-full bg-linear-to-b from-[#0f6f79] to-[#094e55] text-white! py-3 rounded-xl font-medium hover:opacity-90 transition"
                >
                    Return to Dashboard
                </button>
            </div>
        </div>
    );
};

export default CaseExpiredPage;
