import { useEffect, useMemo } from "react";
import AppRoutes from "./routes/AppRoutes";

function App() {
    const consoleMethods = useMemo(
        () => ["log", "error", "debug", "warn", "info", "trace", "table", "group", "groupEnd"],
        []
    );

    useEffect(() => {
        if (window.location.hostname !== "localhost") {
            consoleMethods.forEach((method) => {
                console[method] = () => {};
            });
        }
    }, [consoleMethods]);

    return (
        <div className="App">
            <AppRoutes />
        </div>
    );
}

export default App;
