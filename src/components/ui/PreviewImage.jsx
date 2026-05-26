import { useState } from "react";
import ImageLoader from "./ImageLoader";
import SkeletonLoader from "./Skeleton/SkeletonLoader";

export function PreviewImage({ src, label, containerClass = "", imageClass = "" }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [modalLoading, setModalLoading] = useState(true);

    if (!src) {
        return <div className="text-sm text-gray-400 text-center">No Image</div>;
    }

    return (
        <>
            <div
                className={`relative cursor-pointer overflow-hidden ${containerClass}`}
                onClick={() => setOpen(true)}
            >
                {loading && (
                    <div className="absolute inset-0 z-10">
                        <SkeletonLoader />
                    </div>
                )}

                <ImageLoader
                    imageKey={src}
                    className={`w-full h-full object-cover transition-transform hover:scale-105 ${imageClass} ${
                        loading ? "opacity-0" : "opacity-100"
                    }`}
                    onLoad={() => setLoading(false)}
                />

                {label && (
                    <div className="p-2 text-sm text-gray-600 text-center bg-white/80 backdrop-blur">
                        {label}
                    </div>
                )}
            </div>

            {open && (
                <div
                    className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={() => setOpen(false)}
                >
                    <div
                        className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="relative flex-1 overflow-auto">
                            {modalLoading && (
                                <div className="absolute inset-0 z-10 flex items-center justify-center">
                                    <SkeletonLoader />
                                </div>
                            )}

                            <ImageLoader
                                imageKey={src}
                                className={`w-full max-h-[80vh] object-contain ${
                                    modalLoading ? "opacity-0" : "opacity-100"
                                }`}
                                onLoad={() => setModalLoading(false)}
                            />
                        </div>

                        {label && (
                            <div className="p-4 border-t text-sm text-gray-600 text-center bg-white sticky bottom-0">
                                {label}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
