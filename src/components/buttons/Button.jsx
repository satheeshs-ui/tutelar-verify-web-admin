import { Button as AntButton } from "antd";
import { useTheme } from "../contexts/ThemeContext";

export default function Button({
    children,
    className = "",
    onNotify,
    notifyParams = null,
    ...rest
}) {
    const { theme } = useTheme();

    const handleClick = () => {
        if (typeof onNotify === "function") {
            onNotify(notifyParams);
        }
    };

    return (
        <AntButton
            {...rest}
            className={`!bg-primary !text-white hover:!opacity-90 rounded-lg px-4 py-2 ${className}`}
            style={{
                fontFamily: theme.typography.fontFamily,
            }}
            onClick={handleClick}
        >
            {children}
        </AntButton>
    );
}
