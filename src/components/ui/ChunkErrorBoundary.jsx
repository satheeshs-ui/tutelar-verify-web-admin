import React from "react";

class ChunkErrorBoundary extends React.Component {
    state = { hasError: false };

    static getDerivedStateFromError(error) {
        if (error?.message?.includes("Failed to fetch dynamically imported module")) {
            window.location.reload();
        }
        return { hasError: true };
    }

    render() {
        return this.props.children;
    }
}

export default ChunkErrorBoundary;
