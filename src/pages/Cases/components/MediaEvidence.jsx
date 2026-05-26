import { useEffect, useRef, useState } from "react";
import { Card } from "../../../components/ui/Card";

export function MediaEvidence({ reportDetails }) {
    const videoRef = useRef(null);
    const [videoUrl, setVideoUrl] = useState("");

    useEffect(() => {
        if (reportDetails?.caseRecording) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setVideoUrl(reportDetails.caseRecording);
        }
    }, [reportDetails?.caseRecording]);

    useEffect(() => {
        if (!videoRef.current || !videoUrl) return;

        const video = videoRef.current;

        video.pause();
        video.removeAttribute("src");
        video.load();

        setTimeout(() => {
            video.src = videoUrl;
            video.load();
        }, 0);
    }, [videoUrl]);

    if (!videoUrl) {
        return <div className="text-gray-400 text-sm text-center mt-6">Loading recording…</div>;
    }

    return (
        <Card className="space-y-6 mt-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Media Evidence</h1>
                <div className="h-px bg-gray-200" />
            </div>

            <Card className="border border-gray-200 p-6 space-y-6">
                <h2 className="text-2xl font-semibold text-gray-900">Full Video Recording</h2>

                <div className="w-full max-w-4xl mx-auto">
                    <div className="aspect-4/3 bg-black rounded-2xl overflow-hidden">
                        <video
                            ref={videoRef}
                            controls
                            preload="metadata"
                            playsInline
                            className="w-full h-full object-contain"
                        >
                            Your browser does not support the video tag.
                        </video>
                    </div>
                </div>
            </Card>
        </Card>
    );
}
