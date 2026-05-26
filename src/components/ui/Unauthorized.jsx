import React from "react";

const Unauthorized = ({ message, code = 401 }) => {
    return (
        <div className="h-full overflow-hidden flex items-center justify-center bg-gradient-to-br">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-10 text-center">
                <div className="text-7xl font-bold text-red-700 mb-3">{code}</div>

                <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                    {code === 403 ? "Access Forbidden" : "Unauthorized"}
                </h2>

                <p className="text-sm text-gray-500 mb-6">
                    {message || "You don’t have permission to access this session."}
                </p>

                <div className="h-px bg-gray-200 mb-6" />
            </div>
        </div>
    );
};

export default Unauthorized;
