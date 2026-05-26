import { lazy } from "react";

export function multiLazy(importFn) {
    return lazy(() =>
        importFn().catch((error) => {
            const message = error?.message || "";

            const isChunkError =
                message.includes("Failed to fetch dynamically imported module") ||
                message.includes("Importing a module script failed") ||
                message.includes("Loading chunk");

            if (isChunkError) {
                window.location.reload();
            }

            throw error;
        })
    );
}
