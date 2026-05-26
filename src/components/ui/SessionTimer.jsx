import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import useCaseStore from "../../store/Case/useCaseStore";

// rename prop for clarity
export default function SessionTimer({ expiresAt }) {
    const { setSessionExpired, setSessionTime } = useCaseStore();
    const getInitialRemaining = () => {
        if (!expiresAt) return 0;
        return Math.max(new Date(expiresAt).getTime() - Date.now(), 0);
    };

    const [remaining, setRemaining] = useState(getInitialRemaining);

    useEffect(() => {
        if (!expiresAt) return;

        let timerId;

        const tick = () => {
            const left = Math.max(new Date(expiresAt).getTime() - Date.now(), 0);

            setRemaining(left);

            if (left <= 0) return;

            timerId = setTimeout(tick, 1000 - (Date.now() % 1000));
        };

        tick();
        return () => clearTimeout(timerId);
    }, [expiresAt]);

    const formatTime = (ms) => {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    };

    const isWarning = remaining <= 5 * 60 * 1000; // < 5 minutes
    useEffect(() => {
        if (remaining === 0) {
            setSessionExpired(true);
            setSessionTime(null);
        }
    }, [remaining, setSessionExpired]);

    return (
        <div
            className={`
      fixed top-5 left-1/3 z-50
      -translate-x-1/2
      flex items-center gap-2
      px-3 py-2
      rounded-lg shadow-md backdrop-blur
      text-sm font-medium
      transition-colors
      ${isWarning ? "bg-red-600/90 text-white animate-pulse" : "bg-black/70 text-white"}
    `}
            aria-label="Session countdown timer"
        >
            <Clock className={`w-4 h-4 ${isWarning ? "text-white" : "text-green-400"}`} />
            <span>{formatTime(remaining)}</span>
        </div>
    );
}
