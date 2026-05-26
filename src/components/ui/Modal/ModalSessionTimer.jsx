import { useEffect, useState } from "react";

export default function ModalSessionTimer({ expiresAt }) {
    const [timeLeft, setTimeLeft] = useState(null);
    const [isUrgent, setIsUrgent] = useState(false);

    useEffect(() => {
        if (!expiresAt) return;

        const calculateTimeLeft = () => {
            const now = Date.now();
            const expiry = new Date(expiresAt).getTime();
            const diff = expiry - now;

            if (diff <= 0) {
                setTimeLeft(null);
                return;
            }

            setIsUrgent(diff < 5 * 60 * 1000);

            const totalSeconds = Math.floor(diff / 1000);
            const totalMinutes = Math.floor(totalSeconds / 60);
            const totalHours = Math.floor(totalMinutes / 60);
            const days = Math.floor(totalHours / 24);

            const hours = totalHours % 24;
            const minutes = totalMinutes % 60;
            const seconds = totalSeconds % 60;

            let formatted = "";

            if (days >= 1) {
                formatted = `${days}d ${hours}h`;
            } else if (totalHours >= 12) {
                formatted = `${totalHours}h ${minutes}m`;
            } else if (totalHours >= 1) {
                formatted = `${String(totalHours).padStart(2, "0")}h ${String(minutes).padStart(
                    2,
                    "0"
                )}m ${String(seconds).padStart(2, "0")}s`;
            } else {
                formatted = `${String(minutes).padStart(2, "0")}m ${String(seconds).padStart(
                    2,
                    "0"
                )}s`;
            }

            setTimeLeft(formatted);
        };

        calculateTimeLeft();
        const interval = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(interval);
    }, [expiresAt]);

    if (!timeLeft) return null;

    return (
        <div
            className={`
                mt-5 px-6 py-3 rounded-xl text-center min-w-[200px]
                transition-all duration-300
                ${
                    isUrgent
                        ? "bg-red-50 border border-red-200"
                        : "bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100"
                }
            `}
        >
            <p className="text-xs text-gray-500 tracking-wide uppercase">Session starts in</p>

            <p
                key={timeLeft}
                className={`
                    mt-1 text-lg font-semibold tracking-wider
                    transition-all duration-300
                    ${isUrgent ? "text-red-600" : "text-blue-700"}
                `}
            >
                {timeLeft}
            </p>
        </div>
    );
}
