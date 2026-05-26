import { useEffect } from "react";

function WiFiVisualization() {
    useEffect(() => {
        const drawRings = () => {
            const svg = document.querySelector("#wifi-rings");
            if (!svg) return;

            const width = window.innerWidth;
            const height = window.innerHeight;

            const cx = width / 2;
            const cy = height - 60;

            const radii = Array.from({ length: 9 }, (_, i) => (width * (0.9 - i * 0.1)) / 2);

            svg.innerHTML = radii
                .map(
                    (r, i) => `
      <path
        class="wifi-ring"
        style="animation-delay:${(radii.length - i - 1) * 0.4}s"
        d="M ${cx - r},${cy} A ${r},${r} 0 0 1 ${cx + r},${cy}"
      />
    `
                )
                .join("");
        };

        drawRings();
        window.addEventListener("resize", drawRings);
        return () => window.removeEventListener("resize", drawRings);
    }, []);

    const wifiStyles = `
    @keyframes pulse-wifi {
      0%, 100% { opacity: 0.3; }
      50% { opacity: 0.15; }
    }
    @keyframes pulse-wifi-strong {
      0%, 100% { opacity: 0.4; }
      50% { opacity: 0.2; }
    }
    @keyframes blink-wifi {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.4; }
    }
    .wifi-circle-1 { animation: pulse-wifi 2s ease-in-out infinite; }
    .wifi-circle-2 { animation: pulse-wifi 2s ease-in-out 0.3s infinite; }
    .wifi-circle-3 { animation: pulse-wifi 2s ease-in-out 0.6s infinite; }
    .wifi-circle-4 { animation: pulse-wifi-strong 2s ease-in-out 0.9s infinite; }
    .wifi-icon-blink { animation: blink-wifi 1.2s ease-in-out infinite; }
  `;

    return (
        <div className="fixed inset-0 -z-10 pointer-events-none bg-white">
            <svg width="100%" height="100%" style={{ display: "block" }}>
                <defs>
                    <style>{`
            @keyframes wifi-fade {
              0%, 100% { opacity: 0.35; }
              50%      { opacity: 0.15; }
            }
            .wifi-ring {
              stroke: #8DEFFF;
              fill: none;
              stroke-width: 3;
              animation: wifi-fade 3s ease-in-out infinite;
            }
          `}</style>
                </defs>

                <g id="wifi-rings" />
            </svg>

            {/* WiFi Icon */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <style>{wifiStyles}</style>

                <div className="w-16 h-16 bg-teal-400 rounded-full flex items-center justify-center shadow-lg wifi-icon-blink">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z" />
                    </svg>
                </div>
            </div>
        </div>
    );
}

export default WiFiVisualization;
