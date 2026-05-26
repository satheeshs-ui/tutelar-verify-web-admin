const SessionExpired = () => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <div className="bg-white rounded-2xl shadow-xl px-8 py-10 max-w-md w-full text-center">
                {/* Icon */}
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
                    <span className="text-red-600 text-2xl">⏱️</span>
                </div>

                <h1 className="text-xl font-semibold text-gray-900 mb-2">Session Expired</h1>

                <p className="text-gray-600 text-sm leading-relaxed">
                    This verification session has ended because the time limit was reached.
                    <br />
                    For security reasons, it cannot be resumed.
                </p>

                {/* Divider */}
                <div className="mt-6 border-t pt-4 text-xs text-gray-400">
                    Please initiate a new verification if required.
                </div>
            </div>
        </div>
    );
};

export default SessionExpired;
