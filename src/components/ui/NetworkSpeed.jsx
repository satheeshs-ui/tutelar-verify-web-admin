import { useEffect, useState, useRef } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import UseRefreshProtection from "./UseRefreshProtection";

const TEST_FILE = "/speed-test-50kb.bin";

const formatSpeed = (mbps) => {
    if (mbps == null) return "--";

    const MBps = mbps / 8;

    if (MBps < 1) {
        return `${Math.round(MBps * 1024)} KB/s`;
    }

    return `${MBps.toFixed(1)} MB/s`;
};

export default function NetworkSpeed() {
    const [networkStatus, setNetworkStatus] = useState(navigator.onLine);
    const [speed, setSpeed] = useState(null);
    const { disableProtection } = UseRefreshProtection(() => {});

    const handleOnline = () => {
        if (!sessionStorage.getItem("networkReloaded")) {
            disableProtection();
            sessionStorage.setItem("networkReloaded", "true");
            window.location.reload();
        }
    };

    const handleOffline = () => {
        sessionStorage.removeItem("networkReloaded");
    };
    const prevCalcSpeedRef = useRef();
    useEffect(() => {
        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, []);

    useEffect(() => {
        let cancelled = false;

        const measureSpeed = async () => {
            setNetworkStatus(navigator.onLine);
            const start = performance.now();

            try {
                const res = await fetch(TEST_FILE, { cache: "no-store" });
                await res.arrayBuffer();

                const end = performance.now();
                const duration = (end - start) / 1000;

                const mbps = (0.05 * 8) / duration;

                const smoothed =
                    prevCalcSpeedRef.current == null
                        ? mbps
                        : prevCalcSpeedRef.current + (mbps - prevCalcSpeedRef.current) * 0.25;

                const wasSlow = false;

                const isNowGood = false;

                if (wasSlow && isNowGood && !sessionStorage.getItem("networkReloaded")) {
                    disableProtection();
                    sessionStorage.setItem("networkReloaded", "true");

                    setTimeout(() => {
                        window.location.reload();
                    }, 500);
                }

                if (!isNowGood) {
                    sessionStorage.removeItem("networkReloaded");
                }

                prevCalcSpeedRef.current = smoothed;

                if (!cancelled) {
                    setSpeed(smoothed);
                }
            } catch {
                if (!cancelled) setSpeed(null);
            }
        };

        measureSpeed();
        const interval = setInterval(measureSpeed, 3000);

        return () => {
            cancelled = true;
            clearInterval(interval);
        };
    }, []);

    const speedColor =
        speed == null
            ? "text-gray-400"
            : speed < 0.5
              ? "text-red-500"
              : speed < 2
                ? "text-yellow-500"
                : "text-green-500";

    return (
        <>
            {!networkStatus && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-linear-to-br from-gray-900 via-black to-gray-900">
                    <div className="flex flex-col items-center text-center px-8 py-10 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl max-w-sm">
                        <div className="text-red-400 mb-4">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-14 h-14"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={1.5}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M8.111 16.404a5 5 0 017.778 0M5.222 13.515a9 9 0 0113.556 0M2.333 10.626a13 13 0 0119.334 0M3 3l18 18"
                                />
                            </svg>
                        </div>

                        <h2 className="text-xl font-semibold text-white mb-2">
                            {!networkStatus ? "No Internet Connection" : "Poor Internet Connection"}
                        </h2>

                        <p className="text-gray-300 text-sm mb-4">
                            {!networkStatus
                                ? "Your device appears to be offline. Please check your WiFi or network connection."
                                : "Your internet connection is very slow. Please check your network and try again."}
                        </p>

                        <div className="text-xs text-gray-400">
                            The page will reconnect automatically once internet is back.
                        </div>
                    </div>
                </div>
            )}
            <div
                className="
      fixed top-4 right-4 z-40
      flex items-center gap-2
      px-3 py-1.5
      rounded-full
      bg-black/80
      text-xs font-medium
      shadow-md
    "
            >
                <span className="flex items-center gap-0.5 text-green-400">
                    <ArrowUp className="w-3 h-3" />
                    <ArrowDown className="w-3 h-3" />
                </span>

                <span className={speedColor}>{formatSpeed(speed)}</span>
            </div>
        </>
    );
}
