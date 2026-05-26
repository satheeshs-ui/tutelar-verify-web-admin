import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { Tooltip } from "antd";
import { returnSimpleFormatedDate, returnSimpleFormatedDateTime } from "../../utils";

dayjs.extend(utc);
dayjs.extend(timezone);

const getNestedValue = (obj, fields) => {
    if (!obj) return undefined;

    return fields.reduce((acc, key) => {
        if (acc === null || acc === undefined) return undefined;
        return acc[key];
    }, obj);
};

const safeNumber = (value) => {
    if (typeof value === "number") return value;

    return null;
};

const renderTooltipContent = (device, fields, from) => {
    const rawValue = getNestedValue(device, fields);
    const numberValue = safeNumber(rawValue);

    // ************ DEFAULT DISPLAY ************
    const display =
        numberValue !== null ? numberValue.toLocaleString("en-IN") : rawValue?.toString() || "-";

    if (from === "") return <>{display}</>;

    if (from === "2digit") {
        return <>{numberValue !== null ? numberValue.toFixed(2) : "-"}</>;
    }

    if (from === "date") {
        // Fixed: Check if rawValue is valid before formatting
        let formatted = "-";
        if (rawValue) {
            const date = dayjs(rawValue.toString());
            formatted = date.isValid() ? returnSimpleFormatedDate(rawValue) : "-";
        }

        if (formatted === "-") return "-";
        return (
            <Tooltip title={formatted} placement="topLeft">
                <div className="text-[#0B1C20] overflow-hidden text-ellipsis whitespace-nowrap mb-0">
                    {formatted}
                </div>
            </Tooltip>
        );
    }

    if (from === "time") {
        // Fixed: Check if rawValue is valid before formatting
        let formatted = "-";
        if (rawValue) {
            const date = dayjs(rawValue.toString());
            formatted = date.isValid() ? returnSimpleFormatedDateTime(rawValue) : "-";
        }

        if (formatted === "-") return "-";
        return (
            <Tooltip title={formatted} placement="topLeft">
                <div className="text-[#0B1C20] overflow-hidden text-ellipsis whitespace-nowrap mb-0">
                    {formatted}
                </div>
            </Tooltip>
        );
    }

    if (from === "underscore") {
        const text = typeof rawValue === "string" ? rawValue.replace(/_/g, " ") : display;

        return (
            <Tooltip title={text} placement="topLeft">
                <div className="text-[#0B1C20] overflow-hidden text-ellipsis whitespace-nowrap mb-0">
                    {text}
                </div>
            </Tooltip>
        );
    }

    if (display === "-") return "-";
    // Default tooltip fallback
    return (
        <Tooltip title={display} placement="topLeft">
            <div
                // className={`${fields.includes("email") || fields.includes("phone") || fields.includes("mobile") || fields.includes("returnUrl") ? "text-[#375e9c]!" : ""} text-gray-900 font-normal overflow-hidden text-ellipsis whitespace-nowrap mb-0`}
                className={`${fields.includes("returnUrl") ? "text-[#375e9c]!" : ""} text-[#0B1C20] font-normal overflow-hidden text-ellipsis whitespace-nowrap mb-0`}
            >
                {display}
            </div>
        </Tooltip>
    );
};

// ===========================
// Tooltip Cell Components
// ===========================

export const TooltipCellOrFirstObject = ({ device, field, from }) => {
    return renderTooltipContent(device, [field], from);
};

export const TooltipCellOrSecondObject = ({ device, fieldOne, fieldTwo, from }) => {
    return renderTooltipContent(device, [fieldOne, fieldTwo], from);
};

export const TooltipCellOrThirdObject = ({ device, fieldOne, fieldTwo, fieldThree, from }) => {
    return renderTooltipContent(device, [fieldOne, fieldTwo, fieldThree], from);
};

export const TooltipCellOrFourthObject = ({
    device,
    fieldOne,
    fieldTwo,
    fieldThree,
    fieldFour,
    from,
}) => {
    return renderTooltipContent(device, [fieldOne, fieldTwo, fieldThree, fieldFour], from);
};
