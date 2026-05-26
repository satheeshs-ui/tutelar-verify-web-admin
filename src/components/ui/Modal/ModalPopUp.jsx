import { useEffect, useState } from "react";
import ImageLoader from "../ImageLoader";

export const ModalPopUp = ({ isOpen, onClose, children, closeBtn }) => {
    const [closing, setClosing] = useState(false);

    useEffect(() => {
        let raf;
        let timer;

        if (!isOpen) {
            raf = requestAnimationFrame(() => setClosing(true));

            timer = setTimeout(() => {
                setClosing(false);
            }, 400);
        } else {
            raf = requestAnimationFrame(() => setClosing(false));
        }

        return () => {
            if (raf) cancelAnimationFrame(raf);
            if (timer) clearTimeout(timer);
        };
    }, [isOpen]);

    const show = isOpen || closing;
    if (!show) return null;

    return (
        <div
            className="modal-overlays flex items-center justify-center"
            onClick={() => !closing && onClose()}
        >
            <div
                className={`modal-boxes ${closing ? "slide-out" : "slide-in"}`}
                onClick={(e) => e.stopPropagation()}
            >
                {closeBtn && (
                    <div className="flex justify-end sticky top-0 bg-[#f5f5f5] z-50 pb-2 pt-5">
                        <button onClick={onClose}>
                            <ImageLoader
                                imageKey="closeIcon"
                                className="w-9 h-9 bg-[#F1F5F9] contain-size p-2 rounded-3xl shadow cursor-pointer"
                            />
                        </button>
                    </div>
                )}

                {children}
            </div>
        </div>
    );
};
