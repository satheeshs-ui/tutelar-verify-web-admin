import React from "react";

const CaseVerificationPending = ({ caseId }) => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-100 to-slate-50 font-sans">
            <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg text-center">
                {/* Icon */}
                <div className="text-4xl mb-3">⏳</div>

                {/* Title */}
                <h2 className="text-xl font-semibold text-orange-500 mb-2">
                    Verification in Progress
                </h2>

                {/* Subtitle */}
                <p className="text-sm text-gray-700 mb-3">
                    Your case verification is currently being processed.
                </p>

                {/* Case ID */}
                {caseId && (
                    <div className="inline-block bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-md mb-3">
                        <span className="font-medium">Case ID:</span> {caseId}
                    </div>
                )}

                {/* Info */}
                <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                    This usually takes a few moments. You can refresh the status or check back after
                    some time.
                </p>

                {/* Buttons */}
                <div className="flex justify-center gap-3">
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-medium transition"
                    >
                        Check Status
                    </button>
                </div>

                {/* Footer */}
                <p className="mt-5 text-xs text-gray-400">
                    If this takes longer than expected, please try again later.
                </p>
            </div>
        </div>
    );
};

export default CaseVerificationPending;
