import React from "react";

const RadioField = ({
    checked = false,
    setChecked,
    disabled = false,
    name,
    label,
    labelCss = "",
    error,
    customstyle,
}) => {
    return (
        <div style={customstyle} className="flex flex-col gap-1">
            <label
                htmlFor={name}
                className={`flex items-center gap-2 cursor-pointer ${
                    disabled ? "opacity-50 cursor-not-allowed" : ""
                }`}
            >
                <input
                    id={name}
                    type="radio"
                    name={name}
                    checked={checked}
                    onChange={() => setChecked(true)}
                    disabled={disabled}
                    className="hidden"
                />

                <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                        checked ? "border-primary" : "border-[#D1D5DC]"
                    }`}
                >
                    {checked && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                </div>

                {label && (
                    <span
                        className={`text-sm font-medium ${checked ? "text-primary" : "text-[#374151]"} ${labelCss}`}
                    >
                        {label}
                    </span>
                )}
            </label>

            {error && <p className="text-red-600 text-xs">{error}</p>}
        </div>
    );
};

export default RadioField;
