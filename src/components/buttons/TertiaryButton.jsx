import React from "react";

const TertiaryButton = ({
    label,
    customstyle,
    onNotify,
    iconLeft = null,
    iconRight = null,
    className = "",
    notifyParams = null,
    disabled = false,
    ...rest
}) => {
    const handleClick = () => {
        if (typeof onNotify === "function") {
            onNotify(notifyParams); // ✅ Call your customstyle logic
        }
        // ✅ Do NOT prevent default or stop propagation – let form submission happen naturally
    };
    return (
        <button
            type="button"
            className={`px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition ${className}`}
            style={customstyle}
            onClick={handleClick}
            disabled={disabled}
            {...rest}
        >
            {iconLeft && <span className="mr-2">{iconLeft}</span>}
            {label}
            {iconRight && <span className="ml-2">{iconRight}</span>}
        </button>
    );
};

export default TertiaryButton;
