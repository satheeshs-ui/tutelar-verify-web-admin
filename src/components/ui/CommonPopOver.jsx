import React, { useEffect, useRef, useState, useCallback } from "react";

const CommonPopover = ({ trigger, children }) => {
    const [open, setOpen] = useState(false);
    const [coords, setCoords] = useState({ top: 0, left: 0 });

    const triggerRef = useRef(null);
    const popoverRef = useRef(null);

    // -----------------------------
    // Update Position
    // -----------------------------
    // const updatePosition = useCallback(() => {
    //     if (!triggerRef.current) return;

    //     const rect = triggerRef.current.getBoundingClientRect();

    //     setCoords({
    //         top: rect.bottom + 8,
    //         left: Math.max(10, rect.right - 160),
    //     });
    // }, []);

    const updatePosition = useCallback(() => {
        if (!triggerRef.current) return;

        const rect = triggerRef.current.getBoundingClientRect();

        const container = triggerRef.current.closest(".table-container");

        // CASE 1: Table
        if (container) {
            const containerRect = container.getBoundingClientRect();
            const popWidth = popoverRef.current?.offsetWidth || 160;

            setCoords({
                top: rect.bottom - containerRect.top + 6,
                left: rect.right - containerRect.left - popWidth + 6,
            });
        }

        // CASE 2: Default
        else {
            setCoords({
                top: rect.bottom + 8,
                left: Math.max(10, rect.right - 160),
            });
        }
    }, []);

    // -----------------------------
    // Toggle
    // -----------------------------
    const togglePopover = () => {
        if (!open) updatePosition();
        setOpen((prev) => !prev);
    };

    const closePopover = () => setOpen(false);

    // -----------------------------
    // Outside click
    // -----------------------------
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                popoverRef.current &&
                !popoverRef.current.contains(e.target) &&
                triggerRef.current &&
                !triggerRef.current.contains(e.target)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // -----------------------------
    // Scroll / Resize Reposition
    // -----------------------------
    useEffect(() => {
        if (!open) return;

        updatePosition();

        const scrollParents = [];
        let parent = triggerRef.current?.parentNode;

        while (parent) {
            if (parent instanceof Element) {
                const style = window.getComputedStyle(parent);
                const overflowY = style.overflowY;
                const overflowX = style.overflowX;

                if (
                    overflowY === "auto" ||
                    overflowY === "scroll" ||
                    overflowX === "auto" ||
                    overflowX === "scroll"
                ) {
                    scrollParents.push(parent);
                }
            }

            parent = parent.parentNode;
        }

        scrollParents.forEach((el) => {
            el.addEventListener("scroll", updatePosition);
        });

        window.addEventListener("scroll", updatePosition, true);
        window.addEventListener("resize", updatePosition);

        return () => {
            scrollParents.forEach((el) => {
                el.removeEventListener("scroll", updatePosition);
            });

            window.removeEventListener("scroll", updatePosition, true);
            window.removeEventListener("resize", updatePosition);
        };
    }, [open, updatePosition]);

    return (
        <>
            <div
                ref={triggerRef}
                onClick={togglePopover}
                style={{ display: "inline-block", cursor: "pointer" }}
            >
                {trigger}
            </div>

            {open && (
                <div
                    ref={popoverRef}
                    className="common-popover-fixed"
                    style={{
                        top: coords.top,
                        left: coords.left,
                    }}
                >
                    {typeof children === "function" ? children({ closePopover }) : children}
                </div>
            )}
        </>
    );
};

export default CommonPopover;
