import { useState } from "react";
import SkeletonLoader from "./Skeleton/SkeletonLoader";
import ImageLoader from "./ImageLoader";

export function PreviewPdf({ src, label, containerClass = "" }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [modalLoading, setModalLoading] = useState(true);

    if (!src) {
        return <div className="text-sm text-gray-400 text-center">No PDF</div>;
    }

    return (
        <>
            {/* 🔹 Preview Card */}
            <div
                className={`relative cursor-pointer overflow-hidden flex items-center justify-center bg-gray-100 ${containerClass}`}
                onClick={() => setOpen(true)}
            >
                {loading && (
                    <div className="absolute inset-0 z-10">
                        <SkeletonLoader />
                    </div>
                )}

                {/* PDF icon / placeholder */}
                <div
                    className={`flex flex-col items-center justify-center transition-opacity ${
                        loading ? "opacity-0" : "opacity-100"
                    }`}
                    onLoad={() => setLoading(false)}
                >
                    {/* 📄 */}
                    <ImageLoader imageKey={"PdfIcon"} className={"w-10 h-10"} />
                    <p className="text-xs text-gray-500 mt-1">Preview PDF</p>
                </div>

                {label && (
                    <div className="absolute bottom-0 w-full p-2 text-sm text-gray-600 text-center bg-white/80 backdrop-blur">
                        {label}
                    </div>
                )}
            </div>

            {/* 🔹 Modal Preview */}
            {open && (
                <div
                    className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={() => setOpen(false)}
                >
                    <div
                        className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="relative flex-1">
                            {modalLoading && (
                                <div className="absolute inset-0 z-10 flex items-center justify-center">
                                    <SkeletonLoader />
                                </div>
                            )}

                            <iframe
                                src={src}
                                title="PDF Preview"
                                className={`w-full h-[80vh] ${
                                    modalLoading ? "opacity-0" : "opacity-100"
                                }`}
                                onLoad={() => setModalLoading(false)}
                            />
                        </div>

                        {label && (
                            <div className="p-4 border-t text-sm text-gray-600 text-center bg-white">
                                {label}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
