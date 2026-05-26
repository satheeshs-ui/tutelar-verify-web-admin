import React from "react";

const SwitchField = ({
    enabled = false,
    setEnabled,
    disabled = false,
    name,
    label,
    labelCss = "",
    error,
    customstyle,
    buttonStyle,
}) => {
    const toggleSwitch = () => {
        if (!disabled) {
            setEnabled(!enabled);
        }
    };

    return (
        <div style={customstyle} className="flex flex-col gap-1">
            {label && (
                <label htmlFor={name} className={`text-sm font-medium ${labelCss}`}>
                    {label}
                </label>
            )}

            <button
                id={name}
                type="button"
                onClick={toggleSwitch}
                disabled={disabled}
                className={`${
                    buttonStyle ? buttonStyle : "w-12 h-6"
                } flex items-center rounded-full p-1 transition-colors duration-300 ${
                    enabled ? "bg-[#18667C]" : "bg-[#D1D5DC]"
                } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            >
                <div
                    className={`${
                        buttonStyle ? "h-2 w-2" : "w-4 h-4"
                    } bg-white rounded-full shadow-md transition-transform duration-300 ${
                        enabled
                            ? buttonStyle
                                ? "translate-x-1.5"
                                : "translate-x-6"
                            : "-translate-x-0.5"
                    }`}
                />
            </button>

            {error && <p className="text-red-600 text-xs">{error}</p>}
        </div>
    );
};

export default SwitchField;
