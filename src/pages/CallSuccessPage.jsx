import React from "react";
import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CallSuccessPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 text-center">
                {/* Icon */}
                <div className="flex justify-center mb-5">
                    <CheckCircle className="w-16 h-16 text-green-500" />
                </div>

                {/* Heading */}
                <h2 className="text-xl font-bold text-gray-900 mb-3">Call Already Completed</h2>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                    This customer call has already been completed. You cannot access or rejoin this
                    session again. Please return to the dashboard to continue.
                </p>

                {/* Action Button */}
                <button
                    onClick={() => {
                        if (window.opener) {
                            window.opener.location.href = "/case-bucket";
                            window.close();
                        } else {
                            navigate("/case-bucket");
                        }
                    }}
                    className="cursor-pointer w-full bg-linear-to-b from-[#0f6f79] to-[#094e55] text-white! py-3 rounded-xl font-semibold hover:opacity-90 transition"
                >
                    Go to Dashboard
                </button>
            </div>
        </div>
    );
};

export default CallSuccessPage;
