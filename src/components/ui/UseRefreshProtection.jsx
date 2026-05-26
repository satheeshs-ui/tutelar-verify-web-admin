import { useEffect, useState } from "react";

export default function UseRefreshProtection(onConfirmRefresh) {
    const [showModal, setShowModal] = useState(false);

    // SHOW CUSTOM MODAL FOR F5 / CTRL+R
    useEffect(() => {
        const handleKey = (e) => {
            // F5
            if (e.key === "F5") {
                e.preventDefault();
                setShowModal(true);
            }

            // Ctrl + R or Cmd + R
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "r") {
                e.preventDefault();
                setShowModal(true);
            }
        };

        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, []);

    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ""; // required in chrome
    };

    // NATIVE BROWSER WARNING FOR REFRESH BUTTON / TAB CLOSE
    useEffect(() => {
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, []);

    const confirmRefresh = () => {
        onConfirmRefresh(); // disconnect call
        window.removeEventListener("beforeunload", handleBeforeUnload);
        window.location.reload();
    };

    const disableProtection = () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
    };

    return { showModal, setShowModal, confirmRefresh, disableProtection };
}
